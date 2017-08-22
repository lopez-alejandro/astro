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
    fp_row_skip = 1
    if position == 'k' or position == 'def':
        cbs_row_skip = 1
        fp_row_skip = 0
    print('/../../data/projections/cbs/cbs_projections_'+position+'.csv')
    cbs_df = pd.read_csv(basedir + '/../../data/projections/cbs/cbs_projections_'+position+'.csv', skiprows=cbs_row_skip).rename(columns={'FPTS': 'Points'}).sort_values('Player')
    cbs_df.name = 'cbs'

    nfl_df = pd.read_csv(basedir + '/../../data/projections/nfl/nfl_projections_'+position+'.csv', skiprows=1).rename(columns={'Team': 'Player'}).sort_values('Player')
    nfl_df.name = 'nfl'

    espn_df = pd.read_csv(basedir + '/../../data/projections/espn/espn_projections_'+position+'.csv', skiprows=1).rename(columns={'PLAYER, TEAM POS':'Player', 'PTS': 'Points'}).sort_values('Player')
    espn_df.name = 'espn'

    fp_df = pd.read_csv(basedir + '/../../data/projections/fp/fp_projections_'+position+'.csv', skiprows=fp_row_skip).rename(columns={'FPTS': 'Points'}).sort_values('Player')
    fp_df.name = 'fp'

    projections = [ cbs_df, nfl_df, espn_df, fp_df ]

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
    for df in projections:
        df.drop_duplicates('Player', inplace=True)

    # at this point all the '+position+' dataframes are properly sanitized
    # we can now save them as csv files and store them as csv files. index is false
    # since we don't care about the indices of the rows
    for df in projections:
        df.to_csv(basedir + '/../../data/projections/'+df.name+'/'+df.name+'_projections_'+position+'.csv', index=False)

# renames the columns so that they are all standard.
# Expected value passed in is a dictionary where the key is the source and value
# is a dataframe
def renameColumns(projections, position):
    fp_df = projections['fp']
    fp_df.name = 'fp'
    nfl_df = projections['nfl']
    nfl_df.name = 'nfl'

    if position == 'qb':
        fp_df = fp_df.rename(columns={'ATT': 'PASS ATT', 'ATT.1': 'RUSH ATT', 'YDS': 'PASS YDS', 'TDS': 'PASS TDS', 'YDS.1': 'RUSH YDS','TDS.1': 'RUSH TDS'})
        nfl_df = nfl_df.rename(columns={'Int': 'INTS','Yds': 'PASS YDS', 'TD': 'PASS TDS', 'Yds.1': 'RUSH YDS', 'TD.1': 'RUSH TDS', 'Lost': 'FL'})

    if position == 'rb':
        fp_df = fp_df.rename(columns={'ATT': 'RUSH ATT', 'YDS': 'RUSH YDS', 'TDS': 'RUSH TDS', 'YDS.1': 'REC YDS','TDS.1': 'REC TDS'})
        nfl_df = nfl_df.rename(columns={'Yds.1': 'RUSH YDS', 'TD.1': 'RUSH TDS', 'Yds.2': 'REC TDS', 'TD.2': 'REC TDS', 'Lost': 'FL'})

    if position == 'wr':
        fp_df = fp_df.rename(columns={'YDS': 'RUSH YDS', 'TDS': 'RUSH TDS', 'YDS.1': 'REC YDS', 'TDS.1': 'REC TDS'})
        nfl_df = nfl_df.rename(columns={'Yds.1': 'RUSH YDS', 'TD.1': 'RUSH TDS', 'Yds.2': 'REC YDS', 'TD.2': 'REC TDS', 'Lost': 'FL'})

    if position == 'te':
        fp_df = fp_df.rename(columns={'YDS': 'REC YDS', 'TDS': 'REC TDS'})
        nfl_df = nfl_df.rename(columns={'Yds.2': 'REC YDS', 'TD.2': 'REC TDS', 'Lost': 'FL'})

    if position == 'k':
        nfl_df = nfl_df.rename(columns={'Made': 'XPT', '0-19': 'FG ONE', '20-29': 'FG TWO', '30-39': 'FG THREE', '40-49': 'FG FOUR'})

    if position == 'def':
        fp_df = fp_df.rename(columns={'INT': 'INTS', 'SACK': 'SACKS', 'TD': 'TDS'})
        nfl_df = nfl_df.rename(columns={'Sack': 'SACKS', 'Int': 'INTS', 'Fum Rec': 'FR', 'Saf': 'SAFETY', 'TD': 'TDS'})


    fp_df.to_csv(basedir + '/../../data/projections/fp/fp_projections_'+position+'.csv', index=False)
    nfl_df.to_csv(basedir + '/../../data/projections/nfl/nfl_projections_'+position+'.csv', index=False)



def runSanitize():
    positions = ['qb', 'rb', 'wr', 'te', 'k', 'def']
    for pos in positions:
        sanitize(pos)

def loadPositionDataFrame(position):
    fp_row_skip = 1
    if position == 'k' or position == 'def':
        fp_row_skip = 0

    nfl_df = pd.read_csv(basedir + '/../../data/projections/nfl/nfl_projections_'+position+'.csv')
    nfl_df.name = 'nfl'

    fp_df = pd.read_csv(basedir + '/../../data/projections/fp/fp_projections_'+position+'.csv')
    fp_df.name = 'fp'

    projections = {}
    projections['nfl'] = nfl_df
    projections['fp'] = fp_df

    return projections

def runRenameColumns():
    positions = ['qb', 'rb', 'wr', 'te', 'k', 'def']
    for pos in positions:
        projections = loadPositionDataFrame(pos)
        renameColumns(projections, pos)


#sanitizeQb()
runSanitize()
runRenameColumns()
