writeProvinces();
writeStations();

$(document).ready(function() {
    $('input[type=radio][name=data_scope]').change(function() {
        if (this.value == 'provincial') {
            $(document).find(".stations").addClass("hidden");

            setColors("../json/provinceCrime.json");
            $(document).find(".provinces").removeClass("hidden");
            console.log("Load provincial data")
        }
        else if (this.value == 'station') {
            $(document).find(".provinces").addClass("hidden");

            setColors("../json/stationCrime.json");
            $(document).find(".stations").removeClass("hidden");
            console.log("Load station data")
        }
    });
});

d3.json("../json/crimeCategories.json", function(error, data) {
    if (error) return console.error(error);

    for (var i in data) {
        if (data[i] == "Murder") {
            $("#crime-select").append('<option value="'+ data[i] +'" selected>'+ data[i] +'</option>');
        }
        $("#crime-select").append('<option value="'+ data[i] +'">'+ data[i] +'</option>');
    }

    $(document).ready(function() {
        $('select').material_select();
    });
});

var slider = document.getElementById('year-slider');
noUiSlider.create(slider, {
    range: {
        'min': 2004,
        'max': 2013
    },
    step: 1,
    start: [2004],
    pips: {
        mode: 'count',
        values: 10,
        density: 10,
        stepped: true
    }
});

