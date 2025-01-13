import re
import pandas as pd


rulings = {
    '02c': lambda row: False,
    '02g': lambda row: not pd.isna(row['Power text']) and re.search(r"gain.*birdfeeder", row['Power text'], re.IGNORECASE) is not None,
    '03a': lambda row: not pd.isna(row['Power text']) and re.search(r"counts double", row['Power text'], re.IGNORECASE) is not None,
    '20190122': lambda row: False,
    '20190205': lambda row: row['Color'] == 'Pink',
    '20190313': lambda row: row['Color'] == 'Pink',
    '20190601': lambda row: not pd.isna(row['Power text']) and re.search(r"gain", row['Power text'], re.IGNORECASE) is not None and re.search(r"supply", row['Power text'], re.IGNORECASE) is not None and re.search(r"steal", row['Power text'], re.IGNORECASE) is None and re.search(r"give", row['Power text'], re.IGNORECASE) is None,
    '20190908': lambda row: not pd.isna(row['Power text']) and re.search(r"at the end of your turn", row['Power text'], re.IGNORECASE) is not None and re.search(r"keep [0-9]+ and discard the rest", row['Power text'], re.IGNORECASE) is None,
    '20191010': lambda row: not pd.isna(row['Power text']) and re.search(r"at the end of your turn", row['Power text'], re.IGNORECASE) is not None,
    '20191202': lambda row: False,
    '20191203c': lambda row: False,
    '20200109a': lambda row: False, # TODO think about implementation for this one
    '20200208': lambda row: row['Color'] == 'Pink',
    '2020022b': lambda row: not pd.isna(row['Power text']) and re.search(r"it becomes a tucked card", row['Power text'], re.IGNORECASE) is not None,
    '20200330': lambda row: row['Color'] == 'Pink',
    '20200404': lambda row: not pd.isna(row['Power text']) and re.search(r"(\s|^)draw|(\s|^)lay|(\s|^)gain", row['Power text'], re.IGNORECASE) is not None,
    '20200511': lambda row: not pd.isna(row['* (food cost)']),
    '20200712': lambda row: False,
    '20200716a': lambda row: row['Common name'] in ['American Oystercatcher', 'Belted Kingfisher', 'Eastern Kingbird'],
    '20200716b': lambda row: not pd.isna(row['Power text']) and re.search(r"play a bird|play a second bird|play another bird|play 1 bird", row['Power text'], re.IGNORECASE) is not None,
    '20201003': lambda row: False,
    '20201009': lambda row: False,
    '20201116a': lambda row: False,
    '20201117': lambda row: not pd.isna(row['Power text']) and re.search(r"discard.*\[(egg|seed|invertebrate|fish|fruit|nectar|wild|rodent)\]", row['Power text'], re.IGNORECASE) is not None,
    '20210101': lambda row: False,
    '20201211': lambda row: False,
    '20210199a': lambda row: False,
    '20210199b': lambda row: False,
    '20210206': lambda row: not pd.isna(row['Power text']) and re.search(r"place this bird sideways", row['Power text'], re.IGNORECASE) is not None,
    '20210318': lambda row: not pd.isna(row['Power text']) and re.search(r"this bird counts double toward the end-of-round goal", row['Power text'], re.IGNORECASE) is not None,
}
