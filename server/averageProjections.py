import pandas as pd
import numpy as np
import os

basedir = os.path.abspath(os.path.dirname(__file__))
df = pd.read_csv(basedir + '/../data/projections/nfl/nfl_projections_qb.csv', skiprows=1)
text = df.to_string()
print(text)
