let ChartAFC, ChartPFC, ChartRTC, ChartITC;

function createChart(ctx, type, labels, datasets, yTitle, xTitle) {
    return new Chart(ctx, {
        type: type,
        data: {
            labels: labels,
            datasets: datasets
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: {
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: yTitle
                    }
                },
                x: {
                    title: {
                        display: true,
                        text: xTitle
                    }
                }
            },
            elements: {
                point: {
                    radius: 2,
                    hoverRadius: 10,
                    pointHitRadius: 10
                },
                line: {
                    borderWidth: 4,
                    hoverBorderWidth: 8
                }
            }
        }
    });
}

function drawGraphs(data) {
    let ctx_afc = document.getElementById('afc_canvas').getContext('2d');
    let ctx_pfc = document.getElementById('pfc_canvas').getContext('2d');
    let ctx_rtc = document.getElementById('re_time_canvas').getContext('2d');
    let ctx_itc = document.getElementById('im_time_canvas').getContext('2d');

    let freqs = data.freqs;
    let labels = data.labels;
    let time_counts = data.counts;
    let data_afc = data.mods;
    let data_pfc = data.phases;
    let data_re_time = data.count_vals_real;
    let data_im_time = data.count_vals_imag;

    if (ChartAFC) {
        ChartAFC.destroy();
    }
    if (ChartPFC) {
        ChartPFC.destroy();
    }
    if (ChartRTC) {
        ChartRTC.destroy();
    }
    if (ChartITC) {
        ChartITC.destroy();
    }

    ChartAFC = createChart(ctx_afc, 'line', freqs, [
        { label: labels[0], data: data_afc[0] },
        { label: labels[1], data: data_afc[1] },
        { label: labels[2], data: data_afc[2] },
        { label: labels[3], data: data_afc[3] }
    ], "Модули коэффициентов", "Частота, Гц");

    ChartPFC = createChart(ctx_pfc, 'line', freqs, [
        { label: labels[0], data: data_pfc[0] },
        { label: labels[1], data: data_pfc[1] },
        { label: labels[2], data: data_pfc[2] },
        { label: labels[3], data: data_pfc[3] }
    ], "Фазы коэффициентов", "Частота, Гц");

    ChartRTC = createChart(ctx_rtc, 'line', time_counts, [
        { label: labels[0], data: data_re_time[0] },
        { label: labels[1], data: data_re_time[1] },
        { label: labels[2], data: data_re_time[2] },
        { label: labels[3], data: data_re_time[3] }
    ], "Временная характеристика(real)", "Время, с");

    ChartITC = createChart(ctx_itc, 'line', time_counts, [
        { label: labels[0], data: data_im_time[0] },
        { label: labels[1], data: data_im_time[1] },
        { label: labels[2], data: data_im_time[2] },
        { label: labels[3], data: data_im_time[3] }
    ], "Временная характеристика(imag)", "Время, с");
    return false;
}

$(document).ready(function () {
    $('#input form').ajaxForm({
        dataType: 'json',
        success: drawGraphs
    });
    return false;
});