import subprocess, sys, os, shutil, openpyxl
def recalc(path, outdir):
    os.makedirs(outdir, exist_ok=True)
    subprocess.run(["soffice","--headless","--calc","--convert-to","xlsx:Calc MS Excel 2007 XML","--outdir",outdir,path],check=True,capture_output=True,timeout=180)
    return os.path.join(outdir, os.path.basename(path))
def summary(path):
    wb=openpyxl.load_workbook(path,data_only=True); S=wb["Resumo"]
    out=[]
    for row in S.iter_rows(min_row=1,max_row=S.max_row,values_only=True):
        if any(v is not None for v in row): out.append(row[:8])
    return out
if __name__=="__main__":
    p=recalc(sys.argv[1], sys.argv[2])
    for r in summary(p):
        print(" | ".join("" if v is None else (f"{v:,.3f}" if isinstance(v,float) and abs(v)<10 else (f"{v:,.0f}" if isinstance(v,(int,float)) else str(v))) for v in r))
