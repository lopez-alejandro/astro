import pandas as pd
import numpy as np
import os

basedir = os.path.abspath(os.path.dirname(__file__))

# NFL #
nfl_qb_df = pd.read_csv(basedir + '/../data/projections/nfl/nfl_projections_qb.csv')

nfl_rb_df = pd.read_csv(basedir + '/../data/projections/nfl/nfl_projections_rb.csv')

nfl_wr_df = pd.read_csv(basedir + '/../data/projections/nfl/nfl_projections_wr.csv')

nfl_te_df = pd.read_csv(basedir + '/../data/projections/nfl/nfl_projections_te.csv')

nfl_k_df = pd.read_csv(basedir + '/../data/projections/nfl/nfl_projections_k.csv')

nfl_def_df = pd.read_csv(basedir + '/../data/projections/nfl/nfl_projections_def.csv')

# Fantasy Pros
fp_qb_df = pd.read_csv(basedir + '/../data/projections/fp/fp_projections_qb.csv')

fp_rb_df = pd.read_csv(basedir + '/../data/projections/fp/fp_projections_rb.csv')

fp_wr_df = pd.read_csv(basedir + '/../data/projections/fp/fp_projections_wr.csv')

fp_te_df = pd.read_csv(basedir + '/../data/projections/fp/fp_projections_te.csv')

fp_k_df = pd.read_csv(basedir + '/../data/projections/fp/fp_projections_k.csv')

fp_def_df = pd.read_csv(basedir + '/../data/projections/fp/fp_projections_def.csv')

'''
# ESPN #
espn_qb_df = pd.read_csv(basedir + '/../data/projections/espn/espn_projections_qb.csv', skiprows=1).rename(columns={'PLAYER, TEAM POS':'Player'}).sort_values('Player')
#print(espn_qb_df)

espn_rb_df = pd.read_csv(basedir + '/../data/projections/espn/espn_projections_rb.csv', skiprows=1)

espn_wr_df = pd.read_csv(basedir + '/../data/projections/espn/espn_projections_wr.csv', skiprows=1)

espn_te_df = pd.read_csv(basedir + '/../data/projections/espn/espn_projections_te.csv', skiprows=1)

espn_k_df = pd.read_csv(basedir + '/../data/projections/espn/espn_projections_k.csv', skiprows=1)

espn_def_df = pd.read_csv(basedir + '/../data/projections/espn/espn_projections_def.csv', skiprows=1)

# CBS #
cbs_qb_df = pd.read_csv(basedir + '/../data/projections/cbs/cbs_projections_qb.csv', skiprows=2).sort_values('Player')
#print(cbs_qb_df)

cbs_rb_df = pd.read_csv(basedir + '/../data/projections/cbs/cbs_projections_rb.csv', skiprows=2)

cbs_wr_df = pd.read_csv(basedir + '/../data/projections/cbs/cbs_projections_wr.csv', skiprows=2)

cbs_te_df = pd.read_csv(basedir + '/../data/projections/cbs/cbs_projections_te.csv', skiprows=2)

cbs_k_df = pd.read_csv(basedir + '/../data/projections/cbs/cbs_projections_k.csv', skiprows=2)

cbs_def_df = pd.read_csv(basedir + '/../data/projections/cbs/cbs_projections_def.csv', skiprows=1)
'''
def computeAverageQb(cbs_df, espn_df, nfl_df):
    # compute the average for all qbs. Not all players show up in all sources so we will only compute the average of players that are in all three sources
    print('hello')
