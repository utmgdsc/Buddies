import pandas as pd
import requests

endpoint = "http://buddy-alb-1653424214.us-east-1.elb.amazonaws.com/api/v1/projects/ratings"
def update():
    df = pd.read_csv('out-train.csv')
    r = requests.get(endpoint)
    y = r.json()
    x, j = [], 0
    for i in y:
        v = dict()
        for k in i:
            v[k.upper()[:1] + k[1:]] = y[j][k]
        x.append(v)
        j += 1
    
    for row in x:
        if len(df.loc[(df.RaterId == row['RaterId']) & (df.BeingRatedId == row['BeingRatedId']), 'Score']) > 0:
            df.loc[(df.RaterId == row['RaterId']) & (df.BeingRatedId == row['BeingRatedId']), 'Score'] = row['Score']
        else:
            df = df.append(row, ignore_index = True)

    df.to_csv('out-train.csv', index=False)

if __name__ == '__main__':
    update()