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
        print(whitelist)
        proj = proj.take(whitelist)


    print(cbs_df)
    print(nfl_df)
    print(espn_df)

sanitizeQb()
