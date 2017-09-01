import pandas as pd
import numpy as np
import os
import json
import locale
from locale import atof
import sys

locale.setlocale(locale.LC_NUMERIC, '')

basedir = os.path.abspath(os.path.dirname(__file__))

league_settings = None
columns = None
try:
    with open(basedir + '/config.json') as json_file:
        league_settings = json.load(json_file)
        print(league_settings)
except Exception as a:
    print(a)

try:
    with open(basedir + '/columns.json') as json_file:
        columns = json.load(json_file)
        print(columns)
except Exception as a:
    print(a)

# NFL #
nfl_qb_df = pd.read_csv(basedir + '/../data/projections/nfl/nfl_projections_qb.csv', thousands=',')

nfl_rb_df = pd.read_csv(basedir + '/../data/projections/nfl/nfl_projections_rb.csv')

nfl_wr_df = pd.read_csv(basedir + '/../data/projections/nfl/nfl_projections_wr.csv')

nfl_te_df = pd.read_csv(basedir + '/../data/projections/nfl/nfl_projections_te.csv')

nfl_k_df = pd.read_csv(basedir + '/../data/projections/nfl/nfl_projections_k.csv')

nfl_def_df = pd.read_csv(basedir + '/../data/projections/nfl/nfl_projections_def.csv')

# Fantasy Pros
fp_qb_df = pd.read_csv(basedir + '/../data/projections/fp/fp_projections_qb.csv',thousands=',')

fp_rb_df = pd.read_csv(basedir + '/../data/projections/fp/fp_projections_rb.csv',thousands=',')

fp_wr_df = pd.read_csv(basedir + '/../data/projections/fp/fp_projections_wr.csv',thousands=',')

fp_te_df = pd.read_csv(basedir + '/../data/projections/fp/fp_projections_te.csv',thousands=',')

fp_k_df = pd.read_csv(basedir + '/../data/projections/fp/fp_projections_k.csv',thousands=',')

fp_def_df = pd.read_csv(basedir + '/../data/projections/fp/fp_projections_def.csv',thousands=',')

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

df_list = [ (nfl_qb_df, fp_qb_df), (nfl_rb_df, fp_rb_df), (nfl_wr_df, fp_wr_df), (nfl_te_df, fp_te_df), (nfl_k_df,fp_k_df), (nfl_def_df, fp_def_df)]

def computeAverages():
    # compute the average for every source we are given. this means computing the average for each relevant column. Then we use our custom league settings and
    # apply the right multipliers to get the total points from the averaged columns



    positions_list = [ 'qb', 'rb', 'wr', 'te', 'k', 'def']
    average_lists = []

    average_df = fp_qb_df
    for index, row in fp_qb_df.iterrows():
        # compute the total points based on the league settings
        # PASS YDS

        pass_yds = float(row[columns['PASS_YDS']]) * league_settings['passYardsMultiplier']
        # PASS TDS
        pass_tds = float(row[columns['PASS_TDS']]) * league_settings['passTouchdownMultiplier']
        # INTS
        ints = float(row[columns['INTS']]) * league_settings['passInterceptionMultiplier']
        # RUSH YDS
        rush_yds = float(row[columns['RUSH_YDS']]) * league_settings['rushYardsMultiplier']
        # RUSH TDS
        rush_tds = float(row[columns['RUSH_TDS']]) * league_settings['rushTouchdownMultplier']
        # FL
        fl = float(row[columns['FL']]) * league_settings['fumbleLostMultiplier']

        total_points = pass_yds + pass_tds + ints + rush_yds + rush_tds + fl

        average_df.set_value(index, 'Points', total_points)

    average_lists.append(average_df)

    average_df = fp_rb_df
    for index, row in fp_rb_df.iterrows():
        #RUSH YDS
        rush_yds = float(row[columns['RUSH_YDS']]) * league_settings['rushYardsMultiplier']
        # RUSH TDS
        rush_tds = float(row[columns['RUSH_TDS']]) * league_settings['rushTouchdownMultplier']
        # REC YDS
        rec_yds = float(row[columns['REC_YDS']]) * league_settings['recYardsMultiplier']
        # REC TDS
        rec_tds = float(row[columns['REC_TDS']]) * league_settings['recTouchdownMultiplier']
        # FL
        fl = float(row[columns['FL']]) * league_settings['fumbleLostMultiplier']

        total_points = rush_yds + rush_tds + rec_yds + rec_tds + fl

        average_df.set_value(index, 'Points', total_points)

    average_lists.append(average_df)

    average_df = fp_wr_df
    for index, row in fp_wr_df.iterrows():
        #RUSH YDS
        rush_yds = float(row[columns['RUSH_YDS']]) * league_settings['rushYardsMultiplier']
        # RUSH TDS
        rush_tds = float(row[columns['RUSH_TDS']]) * league_settings['rushTouchdownMultplier']
        # REC YDS
        rec_yds = float(row[columns['REC_YDS']]) * league_settings['recYardsMultiplier']
        # REC TDS
        rec_tds = float(row[columns['REC_TDS']]) * league_settings['recTouchdownMultiplier']
        # FL
        fl = float(row[columns['FL']]) * league_settings['fumbleLostMultiplier']

        total_points = rush_yds + rush_tds + rec_yds + rec_tds + fl

        average_df.set_value(index, 'Points', total_points)

    average_lists.append(average_df)

    average_df = fp_te_df
    for index, row in fp_te_df.iterrows():
        # REC YDS
        rec_yds = float(row[columns['REC_YDS']]) * league_settings['recYardsMultiplier']
        # REC TDS
        rec_tds = float(row[columns['REC_TDS']]) * league_settings['recTouchdownMultiplier']
        # FL
        fl = float(row[columns['FL']]) * league_settings['fumbleLostMultiplier']

        total_points = rush_yds + rush_tds + rec_yds + rec_tds + fl

        average_df.set_value(index, 'Points', total_points)

    average_lists.append(average_df)

    average_df = fp_k_df
    for index, row in fp_k_df.iterrows():
        # FG
        fg = float(row[columns['FG']]) * league_settings['fieldGoalMadeMultiplier']
        # XP
        xp = float(row[columns['XPT']]) * league_settings['patMultiplier']

        total_points = fg + xp

        average_df.set_value(index, 'Points', total_points)

    average_lists.append(average_df)

    average_df = fp_def_df
    for index, row in fp_def_df.iterrows():
        # SACKS
        sacks = float(row[columns['SACKS']]) * league_settings['sackMultiplier']
        # INTS
        ints = float(row[columns['INTS']]) * league_settings['defInterceptionMultiplier']
        # FR
        fr = float(row[columns['FR']]) * league_settings['fumbleRecoveredMultiplier']
        # RETURN TDS
        return_tds = float(row[columns['TDS']]) * league_settings['returnTouchdownMultiplier']
        # SAFETY
        safety = float(row[columns['SAFETY']]) * league_settings['safetyMultiplier']

        total_points = sacks + ints + fr + return_tds + safety

        average_df.set_value(index, 'POINTS', total_points)

    average_lists.append(average_df)
    # iterate though our list and take the average for each position
    '''
    for item in df_list:
        average_df = pd.concat((item[0],item[1]))
        average_df = average_df.groupby(average_df.index)
        average_df = average_df.mean()
        print(average_df)
        average_lists.append(average_df)
    '''

    # now we have the averages for each corresponding position in each column. commit to csv file
    for index, df in enumerate(average_lists):
        curr_df = df
        position = positions_list[index]
        curr_df.to_csv(basedir + '/../data/projections/averages/'+ position + '.csv', index = False)

    print('made it to the end, it works!')

computeAverages()
