writeProvinces();
writeStations();

$(document).ready(function() {
    $('input[type=radio][name=data_scope]').change(function() {
        if (this.value == 'provinces') {
            $(document).find(".stations").addClass("hidden");

            setColors("../json/provinceCrime.json", "provinces");
            $(document).find(".provinces").removeClass("hidden");
            console.log("Load provincial data")
        }
        else if (this.value == 'stations') {
            $(document).find(".provinces").addClass("hidden");

            setColors("../json/stationCrime.json", "stations");
            $(document).find(".stations").removeClass("hidden");
            console.log("Load station data")
        }
    });
});

$("#crime-select").on("change", (function() {
    if ($("#provincial_radio").attr("checked") == "checked") {
        setColors("../json/provinceCrime.json", "provinces");
    }
    else {
        setColors("../json/stationCrime.json", "stations");
    }
}));

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

    $(document).ready(function(){
        $('.collapsible').collapsible({
            accordion : true
        });
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

