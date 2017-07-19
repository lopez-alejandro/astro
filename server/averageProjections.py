import pandas as pd
import numpy as np
import os

basedir = os.path.abspath(os.path.dirname(__file__))

# NFL #
nfl_qb_df = pd.read_csv(basedir + '/../data/projections/nfl/nfl_projections_qb.csv', skiprows=1,nrows=60).sort_values('Player')

nfl_rb_df = pd.read_csv(basedir + '/../data/projections/nfl/nfl_projections_rb.csv', skiprows=1, nrows=60)

nfl_wr_df = pd.read_csv(basedir + '/../data/projections/nfl/nfl_projections_wr.csv', skiprows=1)

nfl_te_df = pd.read_csv(basedir + '/../data/projections/nfl/nfl_projections_te.csv', skiprows=1)

nfl_k_df = pd.read_csv(basedir + '/../data/projections/nfl/nfl_projections_k.csv', skiprows=1)

nfl_def_df = pd.read_csv(basedir + '/../data/projections/nfl/nfl_projections_def.csv', skiprows=1)

# ESPN #
espn_qb_df = pd.read_csv(basedir + '/../data/projections/espn/espn_projections_qb.csv', skiprows=1).rename(columns={'PLAYER, TEAM POS':'Player'}).sort_values('Player')
#print(espn_qb_df)

espn_rb_df = pd.read_csv(basedir + '/../data/projections/espn/espn_projections_rb.csv', skiprows=1)

espn_wr_df = pd.read_csv(basedir + '/../data/projections/espn/espn_projections_wr.csv', skiprows=1)

espn_te_df = pd.read_csv(basedir + '/../data/projections/espn/espn_projections_te.csv', skiprows=1)

espn_k_df = pd.read_csv(basedir + '/../data/projections/espn/espn_projections_k.csv', skiprows=1)

espn_def_df = pd.read_csv(basedir + '/../data/projections/espn/espn_projections_def.csv', skiprows=1)

# CBS #
cbs_qb_df = pd.read_csv(basedir + '/../data/projections/cbs/cbs_projections_qb.csv', skiprows=2, nrows=60).sort_values('Player')
#print(cbs_qb_df)

cbs_rb_df = pd.read_csv(basedir + '/../data/projections/cbs/cbs_projections_rb.csv', skiprows=2)

cbs_wr_df = pd.read_csv(basedir + '/../data/projections/cbs/cbs_projections_wr.csv', skiprows=2)

cbs_te_df = pd.read_csv(basedir + '/../data/projections/cbs/cbs_projections_te.csv', skiprows=2)

cbs_k_df = pd.read_csv(basedir + '/../data/projections/cbs/cbs_projections_k.csv', skiprows=2)

cbs_def_df = pd.read_csv(basedir + '/../data/projections/cbs/cbs_projections_def.csv', skiprows=1)
