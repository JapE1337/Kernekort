"""Reproducible fixed-width import of official AME2020 / NUBASE2020 tables."""
import json, hashlib, urllib.request
from pathlib import Path
from datetime import datetime, timezone
import argparse

ROOT = Path(__file__).resolve().parents[1]
URLS = {name: 'https://www-nds.iaea.org/amdc/ame2020/' + name for name in ('mass_1.mas20.txt', 'nubase_4.mas20.txt')}

def number(s):
    s = s.strip().replace('#', '.')
    try: return float(s)
    except ValueError: return None

def build():
    raw = ROOT / 'data/raw'
    records = {}
    for line_no, line in enumerate((raw / 'nubase_4.mas20.txt').read_text().splitlines(), 1):
        if line.startswith('#') or not line.strip(): continue
        a, zi = int(line[:3]), int(line[4:8])
        if zi % 10: continue  # Ground states only; isomers are distinct energy states.
        z = zi // 10
        half = line[69:78].strip()
        records[(z, a)] = dict(z=z, n=a-z, a=a, symbol=line[11:16].strip().lstrip('0123456789'),
            halfLife=half or None, halfLifeUnit=line[78:80].strip(), halfLifeUncertainty=line[81:88].strip() or None,
            halfLifeEstimated='#' in half, stable=half == 'stbl', decay=line[119:209].strip() or None,
            spin=line[88:102].strip() or None, nubaseLine=line_no,
            mass=None, massUncertainty=None, bindingPerA=None, bindingUncertainty=None,
            massExcess=None, massEstimated=None, bindingEstimated=None, ameLine=None)
    for line_no, line in enumerate((raw / 'mass_1.mas20.txt').read_text().splitlines(), 1):
        if line_no <= 36: continue
        n, z, a = int(line[4:9]), int(line[9:14]), int(line[14:19])
        r = records.setdefault((z,a), dict(z=z,n=n,a=a,symbol=line[20:23].strip(),halfLife=None,halfLifeUnit='',halfLifeUncertainty=None,halfLifeEstimated=False,stable=False,decay=None,spin=None,nubaseLine=None))
        integer = number(line[106:109])
        fraction = number(line[110:123])
        r.update(mass=integer + fraction/1e6 if integer is not None and fraction is not None else None,
            massUncertainty=number(line[123:135]), bindingPerA=number(line[54:67]),
            bindingUncertainty=number(line[68:78]), massExcess=number(line[28:42]),
            massEstimated='#' in line[106:123], bindingEstimated='#' in line[54:67], ameLine=line_no)
        if r['massUncertainty'] is not None: r['massUncertainty'] /= 1e6
        if r['bindingPerA'] is not None: r['bindingPerA'] /= 1000
        if r['bindingUncertainty'] is not None: r['bindingUncertainty'] /= 1000
    rows = sorted(records.values(), key=lambda r:(r['z'],r['a']))
    assert len(rows) > 3500
    assert len({(r['z'],r['n']) for r in rows}) == len(rows)
    meta = dict(version='AME2020 + NUBASE2020', scope='Alle grundtilstande; isomerer er ikke medtaget.',
        count=len(rows), importedAt=datetime.now(timezone.utc).isoformat(),
        sources=[dict(file=name,url=url,sha256=hashlib.sha256((raw/name).read_bytes()).hexdigest()) for name,url in URLS.items()],
        citations=['Wang et al., Chinese Physics C 45, 030003 (2021), doi:10.1088/1674-1137/abddb0',
        'Kondev et al., Chinese Physics C 45, 030001 (2021), doi:10.1088/1674-1137/abddae'])
    target = ROOT / 'dist/data/nuclides.json'
    target.parent.mkdir(parents=True,exist_ok=True)
    target.write_text(json.dumps(dict(meta=meta,nuclides=rows),ensure_ascii=False,separators=(',',':')),encoding='utf-8')
    print(f'Imported {len(rows)} ground states; {sum(r["mass"] is not None for r in rows)} AME masses.')

if __name__ == '__main__':
    parser=argparse.ArgumentParser(); parser.add_argument('--download',action='store_true'); args=parser.parse_args()
    if args.download:
        for name,url in URLS.items():
            request=urllib.request.Request(url,headers={'User-Agent':'NuclideAtlas/1.0'})
            with urllib.request.urlopen(request,timeout=90) as response:
                (ROOT / 'data/raw' / name).write_bytes(response.read())
    build()
