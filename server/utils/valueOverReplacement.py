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
# calculate the average value over replacement

qbReplacements = 32
rbReplacements = 33
wrReplacements = 33
teReplacements = 11
kReplacements = 11
defReplacements = 11

qbBaseline = 0
rbBaseline = 0
wrBaseline = 0
teBaseline = 0
kBaseline = 0
defBaseline = 0

# Average dataframes
qb_df = pd.read_csv(basedir + '/../../data/projections/averages/qb.csv',thousands=',')

rb_df = pd.read_csv(basedir + '/../../data/projections/averages/rb.csv',thousands=',')

wr_df = pd.read_csv(basedir + '/../../data/projections/averages/wr.csv',thousands=',')

te_df = pd.read_csv(basedir + '/../../data/projections/averages/te.csv',thousands=',')

k_df = pd.read_csv(basedir + '/../../data/projections/averages/k.csv',thousands=',')

def_df = pd.read_csv(basedir + '/../../data/projections/averages/def.csv',thousands=',')


def computeBaseline():
    global qbBaseline
    global rbBaseline
    global wrBaseline
    global teBaseline
    global kBaseline
    global defBaseline

    # first find the player at the position rank of *Replacements
    qb_row = qb_df.iloc[qbReplacements]
    qb_rowAbove = qb_df.iloc[qbReplacements - 1]
    qb_rowBelow = qb_df.iloc[qbReplacements + 1]

    # add up the players at the baseline above and below and take the average
    qbBaseline = float(qb_row[columns['Points']]) + float(qb_rowBelow[columns['Points']]) + float(qb_rowAbove[columns['Points']])
    qbBaseline = qbBaseline / 3
    print(qbBaseline)

    rb_row = rb_df.iloc[rbReplacements]
    rb_rowAbove = rb_df.iloc[rbReplacements - 1]
    rb_rowBelow = rb_df.iloc[rbReplacements + 1]

    # add up the players at the baseline above and below and take the average
    rbBaseline = float(rb_row[columns['Points']]) + float(rb_rowBelow[columns['Points']]) + float(rb_rowAbove[columns['Points']])
    rbBaseline = rbBaseline / 3

    wr_row = wr_df.iloc[wrReplacements]
    wr_rowAbove = wr_df.iloc[wrReplacements - 1]
    wr_rowBelow = wr_df.iloc[wrReplacements + 1]

    # add up the players at the baseline above and below and take the average
    wrBaseline = float(wr_row[columns['Points']]) + float(wr_rowBelow[columns['Points']]) + float(wr_rowAbove[columns['Points']])
    wrBaseline = wrBaseline / 3

    te_row = te_df.iloc[teReplacements]
    te_rowAbove = te_df.iloc[teReplacements - 1]
    te_rowBelow = te_df.iloc[teReplacements + 1]

    # add up the players at the baseline above and below and take the average
    teBaseline = float(te_row[columns['Points']]) + float(te_rowBelow[columns['Points']]) + float(te_rowAbove[columns['Points']])
    teBaseline = teBaseline / 3

    k_row = k_df.iloc[kReplacements]
    k_rowAbove = k_df.iloc[kReplacements - 1]
    k_rowBelow = k_df.iloc[kReplacements + 1]

    # add up the players at the baseline above and below and take the average
    kBaseline = float(k_row[columns['Points']]) + float(k_rowBelow[columns['Points']]) + float(k_rowAbove[columns['Points']])
    kBaseline = kBaseline / 3

    def_row = def_df.iloc[defReplacements]
    def_rowAbove = def_df.iloc[defReplacements - 1]
    def_rowBelow = def_df.iloc[defReplacements + 1]

    # add up the players at the baseline above and below and take the average
    defBaseline = float(def_row[columns['Points']]) + float(def_rowBelow[columns['Points']]) + float(def_rowAbove[columns['Points']])
    defBaseline = defBaseline / 3



def computeValueOverReplacement():
    positions_list = [ 'qb', 'rb', 'wr', 'te', 'k', 'def']
    value_list = []
    # for every position find the player at the value *Replacements and take the average of their score and the scores of the players one position above and below
    computeBaseline()

    # now we have the baselines for every position so we can calculate the value over replacement for each player
    qb_df['Value'] = ""
    rb_df['Value'] = ""
    wr_df['Value'] = ""
    te_df['Value'] = ""
    k_df['Value'] = ""
    def_df['Value'] = ""

    for index, row in qb_df.iterrows():
        row['Value'] = float(row['Points']) - qbBaseline
        qb_df.iloc[index] = row

    value_list.append(qb_df)

    for index, row in rb_df.iterrows():
        row['Value'] = float(row['Points']) - rbBaseline
        rb_df.iloc[index] = row

    value_list.append(rb_df)

    for index, row in wr_df.iterrows():
        row['Value'] = float(row['Points']) - wrBaseline
        wr_df.iloc[index] = row

    value_list.append(wr_df)

    for index, row in te_df.iterrows():
        row['Value'] = float(row['Points']) - teBaseline
        te_df.iloc[index] = row

    value_list.append(te_df)

    for index, row in k_df.iterrows():
        row['Value'] = float(row['Points']) - kBaseline
        k_df.iloc[index] = row

    value_list.append(k_df)

    for index, row in def_df.iterrows():
        row['Value'] = float(row['Points']) - defBaseline
        def_df.iloc[index] = row

    value_list.append(def_df)

    # now commit the updated df to csv
    for index, df in enumerate(value_list):
        curr_df = df
        position = positions_list[index]
        curr_df.to_csv(basedir + '/../../data/projections/averages/'+ position + '.csv', index = False)



computeValueOverReplacement()
