#!/usr/bin/env python3
import sys
from datetime import date
from pathlib import Path
from shutil import copyfile, rmtree
from subprocess import check_call, DEVNULL

cantons = {
    'ag', 'ai', 'ar', 'be', 'bl', 'bs', 'fr', 'ge', 'gl', 'gr', 'ju', 'lu',
    'ne', 'nw', 'ow', 'sg', 'sh', 'so', 'sz', 'tg', 'ti', 'ur', 'vd', 'vs',
    'zg', 'zh'
}

year = int(len(sys.argv) >= 2 and sys.argv[1] or date.today().year)

output = Path.cwd() / 'topo'
final = Path.cwd() / str(year)

if year < 2013:
    print("Years before 2013 do not exist")
    sys.exit(1)

print("Removing existing data")
if final.exists():
    rmtree(str(final))

final.mkdir()

check_call("make clean", stdout=DEVNULL, stderr=DEVNULL, shell=True)

print("Generating maps for {}".format(year))
check_call(
    "make all YEAR={}".format(year),
    stdout=DEVNULL, stderr=DEVNULL, shell=True
)

print("Organizing result")
for canton in cantons:
    target = final / '{}.json'.format(canton)
    without_lakes = output / '{}-municipalities.json'.format(canton)
    copyfile(str(without_lakes), str(target))

print("Done")
