$(document).ready(function() {
    $('input[type=radio][name=data_scope]').change(function() {
        if (this.value == 'provincial') {
            console.log("Load provincial data")
        }
        else if (this.value == 'station') {
            console.log("Load station data")
        }
    });
});

var slider = document.getElementById('test5');
noUiSlider.create(slider, {
start: [20, 80],
connect: true,
step: 1,
range: {
 'min': 0,
 'max': 100
},
format: wNumb({
 decimals: 0
})
});
