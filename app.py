
from flask import Flask, render_template, request, flash, jsonify

from services import *

app = Flask(__name__)


@app.route('/', methods=['GET'])
def index():
    return render_template("index.html")


@app.route('/result', methods=['POST'])
def get_result():
    filepath = request.files['file']
    if filepath:# and verifyExt(file.filename):
        try:
            values_dict1, values_dict2 = get_data_from_excel(filepath)
            print("Значения, полученные из Excel:")
            print(values_dict1)
            freqs = list(values_dict1)
            print(list(values_dict1.values()))
            print(len(freqs))
            print(np.array(list(values_dict1.values())))
            params1 = np.array(list(values_dict1.values()), dtype=complex).reshape(len(freqs), 2, 2)
            params2 = np.array(list(values_dict2.values()), dtype=complex).reshape(len(freqs), 2, 2)
            pole1 = FourPole(request.form['inForm1'], freqs, params1)
            pole2 = FourPole(request.form['inForm2'], freqs, params2)
            print("Матрицы параметров:\n", pole1.params)
#            return jsonify(pole1.params, pole2.params)

            #переделать в словарик???
            if request.form['conType'] == 'p':
                pole1.calc_form('y')
                pole2.calc_form('y')
            elif request.form['conType'] == 's':
                pole1.calc_form('z')
                pole2.calc_form('z')
            elif request.form['conType'] == 'c':
                pole1.calc_form('a')
                pole2.calc_form('a')

            print(f"Матрицы, пересчитанные под соединение {request.form['conType']}, форма {pole1.form}:")
            print(pole1.params)
            res_pole = calc_con(pole1, pole2)
            print(f"Матрицы получившегося четырехполюсника в форме {res_pole.form}:")
            print(res_pole.params)

            print(f"Четырехполюсник, пересчитанный в требуемую форму({request.form['outForm']}):")
            res_pole.calc_form(request.form['outForm'])
            print(res_pole.params)

            print("4 строки значений коэффициентов:")
            print(res_pole.get_coefs())

            print("Их модули")
            print(res_pole.get_mods())

            print("Их фазы")
            print(res_pole.get_phases())

            scale = 10

            freqs_out = res_pole.freqs
            #print("Дополненные частоты: \n", freqs_out)
            #print("Амплитуды: \n", res_pole.get_mods())
            mods_out = res_pole.get_mods()
            phases_out = res_pole.get_phases()
            print(res_pole.get_freqs_aug())
            time_scale = res_pole.get_time_scale(res_pole.get_freqs_aug())
            count_vals_out = res_pole.get_ifft()
            print("IFFT: \n", count_vals_out)

            return jsonify(
                labels = res_pole.get_labels(),
                freqs = freqs_out,
                mods = mods_out.tolist(),
                phases = phases_out.tolist(),
                counts = time_scale,
                count_vals_real = count_vals_out.real.tolist(),
                count_vals_imag = count_vals_out.imag.tolist()
            )


        except FileNotFoundError as e:
            flash("Ошибка чтения файла", "error")
    else:
        flash("Файл не добавлен или это не Excel файл", "error")

    return "Что-то пошло не так"

if __name__ == "__main__":
    app.run(debug=True)


