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
        cap = round(150 + 1500 / (matches + 2))
        rating_change = round(new_rating - rating)
        if rating_change < -cap:
            rating_change = -cap
        if rating_change > cap:
            rating_change = cap
        rating_changes.append(int(rating_change))
    return rating_changes


info_store = pickle.load(open('info', 'rb'))
def get_info(username):
    for x in info_store:
        if x.username == username:
            # print("Skipping {}".format(username))
            return x

    url = "https://topcoder-rating-predictor.herokuapp.com/api/user/{}"
    r = requests.get(url.format(username))
    data = r.json()

    res = Contestant()
    res.username = username
    res.rating = data['rating']
    res.volatility = data['volatility']
    res.times_played = data['competitions']

    info_store.append(res)
    pickle.dump(info_store, open('info', 'wb'))
    # print("Got info {}".format(username))
    return res


def run_ratings(usernames):
    # Compute rating changes for a list of users, ordered by their performance
    info = [get_info(u) for u in usernames]
    # Skip new members for now
    info = list(filter(lambda x: x.times_played, info))
    N = len(info)
    ratings = [x.rating for x in info]
    volatilities = [x.volatility for x in info]
    match_counts = [x.times_played for x in info]
    scores = [raw_scores[x.username] for x in info]
    places = []
    for i in range(N):
        cur_place = 0.5
        for j in range(N):
            if scores[i] < scores[j]:
                cur_place += 1
            elif scores[i] == scores[j]:
                cur_place += 0.5
        places.append(cur_place)

    res = rating_change(ratings, volatilities, match_counts, places)
    for i in range(N):
        print(info[i].username, res[i])

users = ['tourist', 'Errichto', 'bqi343', 'lhic', 'scott_wu', 'snuke', 'ksun48', 'Petr', 'ecnerwal', 'DEGwer', 'ImbaOvertroll', 'neal_wu', 'qwerty787788', 'boba5551', 'al13n', 'ilyakor', 'dreamoon', 'espr1t', 'Voover', 'WA_TLE', 'chemthan', 'aceofdiamonds', 'kimiyuki', 'fetetriste', 'natsugiri', 'logicmachine', 'RAVEman', 'nuip', 'grikukan', 'kmjp', 'kzyKT', 'egor.lifar', 'nwin', 'TangentDay', 'Filyan', 'hamayanhamayan', 'pickleweasel2', 'mochalka', 'koyumeishi', 'Jatana', 'iafir', 'caustique', 'kuuso1', 'ytoku', 'TianyiChen', 'fragusbot', 'dwoolley3', 'atsT5515', 'shdut', 'kruntuid', 'cjoa2', 'raja1999', 'cintamani', 'chakku', 'IvayloS', 'dhirajfx3', 'tinrodriguez', 'jprakhar77', 'NCT99', 'sazas', 'jml04', 'Alex_Bovk', 'mkagenius', 'liuy0523', 'lxn', 'leaomatheus', 'olphe', 'MauricioC', 'arishabh10', 'Nicolas125841', 'soham7', 'shifath', 'laurent-george', 'shizukanaokami', 'Venkat.Sai', 'zzar', 'BlackKnight21', 'cmouli_84', 't[]rr35', 'ByHunter', 'sampathkumarv', 'moshiur_rahman', 'saisurya027', 'amitdu6ey', 'Faisal_Al_Mamun', 'm0nk3ydluffy', 'ZRELOLERZ', 'monica123', 'manoj69919', 'prashant171992', 'srivatsangenius', 'DeeZL', 'vaibhavsetiya', 'priojeet_priyom', 'prince_of_crows', 'goldfinch', 'thakursahil', 'kaivanshah1663', 'deepak022', 'ath.io', 'trinitrotoluene', 'Arpan_14', 'jesdes', 'ptoolis', 'v_pal', 'Asocasno', 'sekiya9311', 'slex', 'prem_cse', 'roll_no_1', 'nya_nya_meow', 'zizo0003', 'i.amlansaha', 'jehian_norman_s', 'mogproject', 'arshad2117', 'chaturvedim4', 'PiotrJunior', 'bbarrett1114', 'KunalKumar0508', 'sandy7jr', 'szymon20000', 'bhargavasaiy', 'm_dz', 'Loonquawl', 'Tysons_dragoon', 'isti757', 'Abhi_Saini', 'flash_7', 'pit4h', 'vikasmahato0', 'ritesh_malav', 'black_immortal', 'UTSAV_DEEP', 'nmnmnmnmnmnmnm', 'kosakkun', 'HimJ266', 'Andrei1998', 'adamant', 'Wizard[ro]', 'Actor', 'dgistjg', 'JaydevMehta', 'code1548', 'Shunmugaskie', 'homesentinel', 'chuka231', 'Ksys', 'Crazydyz', 'fruwajacybyk']
raw_scores = {'Petr': 127524, 'scott_wu': 135842, 'Errichto': 144609, 'DEGwer': 109865, 'uwi': 0, 'kmjp': 21635, 'bqi343': 142043, 'dreamoon': 71236, 'fruwajacybyk': -7500, 'boba5551': 96563, 'IvayloS': 11003, 'Jatana': 16301, 'kimiyuki': 42715, 'koyumeishi': 16360, 'ryo_issy': 0, 'cjoa2': 11443, 'code1548': 0, 'Alex_Bovk': 7500, 'JaydevMehta': 0, 'qwerty787788': 99853, 'lhic': 138548, 'ecnerwal': 113933, 'grikukan': 22466, 'aceofdiamonds': 45433, 'egor.lifar': 20731, 'chemthan': 46949, 'RAVEman': 33866, 'fetetriste': 41495, 'hamayanhamayan': 18917, 'mochalka': 18018, 'raja1999': 11235, 'dhirajfx3': 10549, 'dgistjg': 0, 'dwoolley3': 12656, 'Copernicium': 0, 'mkagenius': 5891, 'Actor': 0, 'Wizard[ro]': 0, 'tourist': 160342, 'ksun48': 127762, 'ilyakor': 76167, 'Voover': 50001, 'natsugiri': 40927, 'MauricioC': 5000, 'adamant': 0, 'Filyan': 19054, 'TangentDay': 19276, 'Andrei1998': 0, 'shdut': 12289, 'HimJ266': 0, 'kosakkun': 0, 'nmnmnmnmnmnmnm': 0, 'UTSAV_DEEP': 0, 'black_immortal': 0, 'ritesh_malav': 0, 'vikasmahato0': 0, 'pit4h': 0, 'snuke': 131240, 'al13n': 85358, 'Xellos0': 0, 'WA_TLE': 48192, 'iafir': 16297, 'fluffyowl': 0, 'olphe': 5000, 'kzyKT': 21573, 'atsT5515': 12637, 'flash_7': 0, 'Abhi_Saini': 0, 'isti757': 0, 'Tysons_dragoon': 0, 'mu_z3r0': 0, 'Ksys': -2500, 'kruntuid': 11586, 'Loonquawl': 0, 'chuka231': -2500, 'Haresh V': 0, 'neal_wu': 101451, 'ImbaOvertroll': 103765, 'espr1t': 65688, 'm_dz': 0, 'TianyiChen': 14637, 'jml04': 7545, 'bhargavasaiy': 0, 'szymon20000': 0, 'pickleweasel2': 18141, 'tygrysek': 0, 'aditya2469': 0, 'sandy7jr': 0, 'homesentinel': -2500, 'KunalKumar0508': 0, 'kmshihabuddin': 0, 'SleepingSnake': 0, 'e9igma': 0, 'yashagarwal01': 0, 'bbarrett1114': 0, 'PiotrJunior': 0, 'logicmachine': 38765, 'nuip': 29196, 'nwin': 19918, 'fragusbot': 13777, 'kuuso1': 15573, 'chaturvedim4': 0, 'sazas': 9401, 'arshad2117': 0, 'mogproject': 0, 'jehian_norman_s': 0, 'jprakhar77': 9669, 'i.amlansaha': 0, 'Crazydyz': -5000, 'cs_tree': 0, 'zizo0003': 0, 'nya_nya_meow': 0, 'chakku': 11130, 'roll_no_1': 0, 'lalitkumar1995': 0, 'prem_cse': 0, 'slex': 0, 'caustique': 15897, 'hruday_kohli': 0, 'sekiya9311': 0, 'Asocasno': 0, 'v_pal': 0, 'tinrodriguez': 10366, 'ptoolis': 0, 'jesdes': 0, 'cintamani': 11164, 'Arpan_14': 0, 'trinitrotoluene': 0, 'ath.io': 0, 'deepak022': 0, 'kaivanshah1663': 0, 'thakursahil': 0, 'hitsa': 0, 'sai_084': 0, 'dc20': 0, 'Osyakana': 0, 'leaomatheus': 5000, 'lxn': 5000, 'goldfinch': 0, 'prince_of_crows': 0, 'NCT99': 9512, 'priojeet_priyom': 0, 'ytoku': 15539, 'vaibhavsetiya': 0, 'DeeZL': 0, 'srivatsangenius': 0, 'prashant171992': 0, 'Shunmugaskie': -2500, 'manoj69919': 0, 'monica123': 0, 'ZRELOLERZ': 0, 'm0nk3ydluffy': 0, 'Faisal_Al_Mamun': 0, 'TADASHI': 0, 'amitdu6ey': 0, 'akashjain_': 0, 'marius.pungaru': 0, 'mostafaizz': 0, 'liuy0523': 5000, 'saisurya027': 0, 'moshiur_rahman': 0, 'sampathkumarv': 0, 'ByHunter': 0, 't[]rr35': 0, 'cmouli_84': 0, 'BlackKnight21': 0, 'zzar': 0, 'Venkat.Sai': 0, 'shizukanaokami': 0, 'laurent-george': 0, 'shifath': 0, 'soham7': 0, 'Nicolas125841': 0, 'BrianLeeLXT': 0, 'arishabh10': 0, 'O_O_': 0}
run_ratings(users)
