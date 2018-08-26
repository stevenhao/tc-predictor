from math import sqrt, erf
from scipy.stats import norm
import requests
import json
import pickle

class Contestant:
    username = None  # type: Optional[str]
    rating = 0  # type: int
    volatility = 0  # type: int
    times_played = 0  # type: int

    def __repr__(self):
        return "User {}, rating {}, volatility {}, times_played {}".format(self.username, self.rating, 
            self.volatility, self.times_played)

def get_win_prob(r1, v1, r2, v2):
    # Probability for player 1 to beat player 2
    par = (r2 - r1) / (sqrt (2 * (v1 ** 2 + v2 ** 2)))
    return 0.5 * (erf (par) + 1.)

def get_perf(rank, N):
    return -norm.ppf((rank - 0.5) / N)

def rating_change(ratings, volatilities, match_counts, places):
    # Rating changes of each coder assuming they get place [place] (1-indexed)
    print("here")
    N = len(ratings)

    vol_sq = sum(v ** 2 for v in volatilities) / N
    rating_average = sum(r for r in ratings) / N
    rating_var = sum((r - rating_average) ** 2 for r in ratings) / (N - 1)

    CF = sqrt(vol_sq + rating_var)

    rating_changes = []
    for player in range(N):
        erank = 0.5
        for i in range(N):
            erank += get_win_prob(ratings[player], volatilities[player], ratings[i], volatilities[i])
            # print(erank)

        eperf = get_perf(erank, N)
        aperf = get_perf(places[player], N)
        # print(eperf, aperf)

        rating = ratings[player]
        matches = match_counts[player]
        perf_as = rating + CF * (aperf - eperf)
        weight = 1 / (1 - (0.42 / (matches + 1) + 0.18)) - 1
        if rating >= 2500:
            weight = weight * 0.8
        elif rating >= 2000:
            weight = weight * 0.9

        new_rating = (rating + weight * perf_as) / (1 + weight)
        cap = 150 + 1500 / (matches + 2)
        if new_rating > rating + cap:
            new_rating = rating + cap
        if new_rating < rating - cap:
            new_rating = rating - cap

        rating_change = int(new_rating - rating + 0.5)
        rating_changes.append(rating_change)
    return rating_changes


info_store = pickle.load(open('info', 'rb'))
def get_info(username):
    for x in info_store:
        if x.username == username:
            print("Skipping {}".format(username))
            return x

    url = "https://topcoder-rating-predictor.herokuapp.com/api/user/{}"
    r = requests.get(url.format(username))
    data = r.json()

    res = Contestant()
    res.username = username
    res.rating = data['rating']
    res.volatility = data['volatility']
    if not res.volatility:
        res.volatility = 500
    res.times_played = data['competitions']
    info_store.append(res)
    pickle.dump(info_store, open('info', 'wb'))
    print("Got info {}".format(username))
    return res


def run_ratings(usernames):
    # Compute rating changes for a list of users, ordered by their performance
    N = len(usernames)
    info = [get_info(u) for u in usernames]
    ratings = [x.rating for x in info]
    volatilities = [x.volatility for x in info]
    match_counts = [x.times_played for x in info]
    places = [i + 1 for i in range(N)]

    res = rating_change(ratings, volatilities, match_counts, places)
    for i in range(N):
        print(usernames[i], res[i])

users = ['tourist', 'Errichto', 'bqi343', 'lhic', 'scott_wu', 'snuke', 'ksun48', 'Petr', 'ecnerwal', 'DEGwer', 'ImbaOvertroll', 'neal_wu', 'qwerty787788', 'boba5551', 'al13n', 'ilyakor', 'dreamoon', 'espr1t', 'Voover', 'WA_TLE', 'chemthan', 'aceofdiamonds', 'kimiyuki', 'fetetriste', 'natsugiri', 'logicmachine', 'RAVEman', 'nuip', 'grikukan', 'kmjp', 'kzyKT', 'egor.lifar', 'nwin', 'TangentDay', 'Filyan', 'hamayanhamayan', 'pickleweasel2', 'mochalka', 'koyumeishi', 'Jatana', 'iafir', 'caustique', 'kuuso1', 'ytoku', 'TianyiChen', 'fragusbot', 'dwoolley3', 'atsT5515', 'shdut', 'kruntuid', 'cjoa2', 'raja1999', 'cintamani', 'chakku', 'IvayloS', 'dhirajfx3', 'tinrodriguez', 'jprakhar77', 'NCT99', 'sazas', 'jml04', 'Alex_Bovk', 'mkagenius', 'liuy0523', 'lxn', 'leaomatheus', 'olphe', 'MauricioC', 'arishabh10', 'Nicolas125841', 'soham7', 'shifath', 'laurent-george', 'shizukanaokami', 'Venkat.Sai', 'zzar', 'BlackKnight21', 'cmouli_84', 't[]rr35', 'ByHunter', 'sampathkumarv', 'moshiur_rahman', 'saisurya027', 'amitdu6ey', 'Faisal_Al_Mamun', 'm0nk3ydluffy', 'ZRELOLERZ', 'monica123', 'manoj69919', 'prashant171992', 'srivatsangenius', 'DeeZL', 'vaibhavsetiya', 'priojeet_priyom', 'prince_of_crows', 'goldfinch', 'thakursahil', 'kaivanshah1663', 'deepak022', 'ath.io', 'trinitrotoluene', 'Arpan_14', 'jesdes', 'ptoolis', 'v_pal', 'Asocasno', 'sekiya9311', 'slex', 'prem_cse', 'roll_no_1', 'nya_nya_meow', 'zizo0003', 'i.amlansaha', 'jehian_norman_s', 'mogproject', 'arshad2117', 'chaturvedim4', 'PiotrJunior', 'bbarrett1114', 'KunalKumar0508', 'sandy7jr', 'szymon20000', 'bhargavasaiy', 'm_dz', 'Loonquawl', 'Tysons_dragoon', 'isti757', 'Abhi_Saini', 'flash_7', 'pit4h', 'vikasmahato0', 'ritesh_malav', 'black_immortal', 'UTSAV_DEEP', 'nmnmnmnmnmnmnm', 'kosakkun', 'HimJ266', 'Andrei1998', 'adamant', 'Wizard[ro]', 'Actor', 'dgistjg', 'JaydevMehta', 'code1548', 'Shunmugaskie', 'homesentinel', 'chuka231', 'Ksys', 'Crazydyz', 'fruwajacybyk']
run_ratings(users)
