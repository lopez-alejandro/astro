import pandas as pd
import numpy as np
import json
import os

basedir = os.path.abspath(os.path.dirname(__file__))

columns = None
try:
    with open(basedir + '/../columns.json') as json_file:
        columns = json.load(json_file)
        print(columns)
except Exception as a:
    print(a)

# Average dataframes
qb_df = pd.read_csv(basedir + '/../../data/projections/averages/qb.csv',thousands=',')

rb_df = pd.read_csv(basedir + '/../../data/projections/averages/rb.csv',thousands=',')

wr_df = pd.read_csv(basedir + '/../../data/projections/averages/wr.csv',thousands=',')

te_df = pd.read_csv(basedir + '/../../data/projections/averages/te.csv',thousands=',')

k_df = pd.read_csv(basedir + '/../../data/projections/averages/k.csv',thousands=',')

def_df = pd.read_csv(basedir + '/../../data/projections/averages/def.csv',thousands=',')

#rankings dataframes
qb_rank_df = pd.read_csv(basedir + '/../../data/projections/rankings/qb.csv',thousands=',')

rb_rank_df = pd.read_csv(basedir + '/../../data/projections/rankings/rb.csv',thousands=',')

wr_rank_df = pd.read_csv(basedir + '/../../data/projections/rankings/wr.csv',thousands=',')

te_rank_df = pd.read_csv(basedir + '/../../data/projections/rankings/te.csv',thousands=',')

k_rank_df = pd.read_csv(basedir + '/../../data/projections/rankings/k.csv',thousands=',')

def_rank_df = pd.read_csv(basedir + '/../../data/projections/rankings/def.csv',thousands=',')

def populateRankings():
    positions_list = [ 'qb', 'rb', 'wr', 'te', 'k', 'def']
    value_list = []

    qb_df['ADP'] = ""
    rb_df['ADP'] = ""
    wr_df['ADP'] = ""
    te_df['ADP'] = ""
    k_df['ADP'] = ""
    def_df['ADP'] = ""

    qb_df['STD DEV'] = ""
    rb_df['STD DEV'] = ""
    te_df['STD DEV'] = ""
    wr_df['STD DEV'] = ""
    k_df['STD DEV'] = ""
    def_df['STD DEV'] = ""

    # go through each position and populate the respective position that has that name with their ADP and STD DEV
    for index, row in qb_df.iterrows():
        r = qb_rank_df.loc[qb_rank_df['Player'] == row['Player']]
        if r.empty == False:
            row['ADP'] = float(r['ADP'])
            row['STD DEV'] = float(r['Std Dev'])
        else:
            row['ADP'] = ""
            row['STD DEV'] = ""
        qb_df.iloc[index] = row

    value_list.append(qb_df)

    for index, row in rb_df.iterrows():
        r = rb_rank_df.loc[rb_rank_df['Player'] == row['Player']]
        if r.empty == False:
            row['ADP'] = float(r['ADP'])
            row['STD DEV'] = float(r['Std Dev'])
        else:
            row['ADP'] = ""
            row['STD DEV'] = ""
        rb_df.iloc[index] = row

    value_list.append(rb_df)

    for index, row in wr_df.iterrows():
        r = wr_rank_df.loc[wr_rank_df['Player'] == row['Player']]
        if r.empty == False:
            row['ADP'] = float(r['ADP'])
            row['STD DEV'] = float(r['Std Dev'])
        else:
            row['ADP'] = ""
            row['STD DEV'] = ""
        wr_df.iloc[index] = row

    value_list.append(wr_df)

    for index, row in te_df.iterrows():
        r = te_rank_df.loc[te_rank_df['Player'] == row['Player']]
        if r.empty == False:
            row['ADP'] = float(r['ADP'])
            row['STD DEV'] = float(r['Std Dev'])
        else:
            row['ADP'] = ""
            row['STD DEV'] = ""
        te_df.iloc[index] = row

    value_list.append(te_df)

    for index, row in k_df.iterrows():
        r = k_rank_df.loc[k_rank_df['Player'] == row['Player']]
        if r.empty == False:
            row['ADP'] = float(r['ADP'])
            row['STD DEV'] = float(r['Std Dev'])
        else:
            row['ADP'] = ""
            row['STD DEV'] = ""
        k_df.iloc[index] = row

    value_list.append(k_df)

    for index, row in def_df.iterrows():
        r = def_rank_df.loc[def_rank_df['Team DST'] == row['Player']]
        if r.empty == False:
            row['ADP'] = float(r['ADP'])
            row['STD DEV'] = float(r['Std Dev'])
        else:
            row['ADP'] = ""
            row['STD DEV'] = ""
        def_df.iloc[index] = row
    value_list.append(def_df)

    # now commit the updated df to csv
    for index, df in enumerate(value_list):
        curr_df = df
        position = positions_list[index]
        curr_df.to_csv(basedir + '/../../data/projections/averages/'+ position + '.csv', index = False)



populateRankings()
