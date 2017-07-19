import pandas as pd
import numpy as np

import os

basedir = os.path.abspath(os.path.dirname(__file__))

# purpose of this file is to santize the raw csv data that we got from the CBS
# ESPN and NFL websites. Our main goal is to replace the name of the players
# in the csv with the names we have in our list of players
# second goal is to remove any duplicates
# once this is done we will replace the raw csv files with the sanitized versions
# which can now be used for performing calculations

# first load up all the json values into dataframes. We use lines=True so that every JSON object is treated as it's own row
qb_df = pd.read_json(basedir + '/../../data/players/playerListQB.json', lines = True)
rb_df = pd.read_json(basedir + '/../../data/players/playerListRB.json',lines = True)
wr_df = pd.read_json(basedir + '/../../data/players/playerListWR.json', lines = True)
te_df = pd.read_json(basedir + '/../../data/players/playerListTE.json', lines = True)
k_df = pd.read_json(basedir + '/../../data/players/playerListK.json', lines = True)
def_df = pd.read_json(basedir + '/../../data/players/playerListDEF.json', lines = True)

def sanitizeQb():
    cbs_df = pd.read_csv(basedir + '/../../data/projections/cbs/cbs_projections_qb.csv', skiprows=2).sort_values('Player')
    nfl_df = pd.read_csv(basedir + '/../../data/projections/nfl/nfl_projections_qb.csv', skiprows=1,nrows=60).sort_values('Player')
    espn_df = pd.read_csv(basedir + '/../../data/projections/espn/espn_projections_qb.csv', skiprows=1).rename(columns={'PLAYER, TEAM POS':'Player'}).sort_values('Player')

    qb_projections = [ cbs_df, nfl_df, espn_df ]

    # now that we have loaded all of our qb data we can go ahead and replace the name of those players that match a name in our roster dataframe
    '''
    whitelist = []
    # iterate through the dataframes
    for index, row in qb_df.iterrows():
        # iterate through our projections dataframes
        for proj in qb_projections:
            # check to see if our projections dataframe has a name inside our roster
            rosterIndex = proj[proj['Player'].str.contains(row['displayName'])]
            if rosterIndex.empty == False:
                # we are in the roster, replace name in dataframe with roster name
                # get the row from our roster
                proj.set_value(rosterIndex.index, 'Player', row['displayName'])
                whitelist.append(rosterIndex.index)
    print(whitelist)
    for proj in qb_projections:
        for index, row in proj.iterrows():
            if index not in whitelist:
                proj.drop(proj.index[index])
    '''

    for proj in qb_projections:
        whitelist = []
        # iterate through our projections dataframes
        for index, row in qb_df.iterrows():
            # check to see if our projections dataframe has a name inside our roster
            rosterIndex = proj[proj['Player'].str.contains(row['displayName'])]
            if rosterIndex.empty == False:
                # we are in the roster, replace name in dataframe with roster name
                # get the row from our roster
                proj.set_value(rosterIndex.index, 'Player', row['displayName'])
                whitelist.append(rosterIndex.index[0])
        # now remove any rows that we could not find in our roster
        for i, r in proj.iterrows():
            if i not in whitelist:
                proj.drop(i, inplace=True)
    # now remove any duplicates based on the name
    cbs_df = cbs_df.drop_duplicates('Player')
    nfl_df = nfl_df.drop_duplicates('Player')
    espn_df = espn_df.drop_duplicates('Player')

    # at this point all the qb dataframes are properly sanitized
    # we can now save them as csv files and store them as csv files.
    cbs_df.to_csv(basedir + '/../../data/projections/cbs/cbs_projections_qb.csv')
    nfl_df.to_csv(basedir + '/../../data/projections/nfl/nfl_projections_qb.csv')
    espn_df.to_csv(basedir + '/../../data/projections/espn/espn_projections_qb.csv')

    print(cbs_df)
    print(nfl_df)
    print(espn_df)

def checkPosition(position):
    position_df = None
    if position == 'qb':
        position_df = qb_df
    if position == 'rb':
        position_df = rb_df
    if position == 'wr':
        position_df = wr_df
    if position == 'te':
        position_df = te_df
    if position == 'k':
        position_df = k_df
    if position == 'def':
        position_df = def_df
    return position_df

def sanitize(position):
    position_df = checkPosition(position)
    cbs_row_skip = 2
    if position == 'k' or position == 'def':
        cbs_row_skip = 1
    print('/../../data/projections/cbs/cbs_projections_'+position+'.csv')
    cbs_df = pd.read_csv(basedir + '/../../data/projections/cbs/cbs_projections_'+position+'.csv', skiprows=cbs_row_skip).rename(columns={'FPTS': 'Points'}).sort_values('Player')
    nfl_df = pd.read_csv(basedir + '/../../data/projections/nfl/nfl_projections_'+position+'.csv', skiprows=1).rename(columns={'Team': 'Player'}).sort_values('Player')
    espn_df = pd.read_csv(basedir + '/../../data/projections/espn/espn_projections_'+position+'.csv', skiprows=1).rename(columns={'PLAYER, TEAM POS':'Player', 'PTS': 'Points'}).sort_values('Player')

    projections = [ cbs_df, nfl_df, espn_df ]

    # now that we have loaded all of our '+position+' data we can go ahead and replace the name of those players that match a name in our roster dataframe

    for proj in projections:
        whitelist = []
        # iterate through our projections dataframes
        for index, row in position_df.iterrows():
            # check to see if our projections dataframe has a name inside our roster
            rosterIndex = None
            if position == 'def':
                rosterIndex = proj[proj['Player'].str.contains(row['lname'])]
            else:
                rosterIndex = proj[proj['Player'].str.contains(row['displayName'])]
            if rosterIndex.empty == False:
                # we are in the roster, replace name in dataframe with roster name
                # get the row from our roster
                proj.set_value(rosterIndex.index, 'Player', row['displayName'])
                whitelist.append(rosterIndex.index[0])
        # now remove any rows that we could not find in our roster
        for i, r in proj.iterrows():
            if i not in whitelist:
                proj.drop(i, inplace=True)
    # now remove any duplicates based on the name
    cbs_df = cbs_df.drop_duplicates('Player')
    nfl_df = nfl_df.drop_duplicates('Player')
    espn_df = espn_df.drop_duplicates('Player')

    # at this point all the '+position+' dataframes are properly sanitized
    # we can now save them as csv files and store them as csv files. index is false
    # since we don't care about the indices of the rows
    cbs_df.to_csv(basedir + '/../../data/projections/cbs/cbs_projections_'+position+'.csv', index=False)
    nfl_df.to_csv(basedir + '/../../data/projections/nfl/nfl_projections_'+position+'.csv', index=False)
    espn_df.to_csv(basedir + '/../../data/projections/espn/espn_projections_'+position+'.csv', index=False)

    print(cbs_df)
    print(nfl_df)
    print(espn_df)

def runSanitize():
    positions = ['qb', 'rb', 'wr', 'te', 'k', 'def']
    for pos in positions:
        sanitize(pos)
#sanitizeQb()
runSanitize()
