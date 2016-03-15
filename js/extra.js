writeProvinces();
writeStations();

$(document).ready(function() {
    $('input[type=radio][name=data_scope]').change(function() {
        if (this.value == 'provinces') {
            $(document).find(".stations").addClass("hidden");

            update();
            $(document).find(".provinces").removeClass("hidden");
        }
        else if (this.value == 'stations') {
            $(document).find(".provinces").addClass("hidden");

            update();
            $(document).find(".stations").removeClass("hidden");
        }
    });
});

$("#crime-select").on("change", function() {
    update();
});

$("#provincial_radio").on("click", function() {
    $(this).attr("checked", "checked");
    $("#station_radio").attr("checked", false);
});

$("#station_radio").on("click", function() {
    $(this).attr("checked", "checked");
    $("#provincial_radio").attr("checked", false);
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

    $(document).ready(function(){
        $('.collapsible').collapsible({
            accordion : true
        });
    });

    $(document).ready(function(){
        $('.tooltipped').tooltip({delay: 50});
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

slider.noUiSlider.on('update', function(){
    update();
});

$("#best-worst").on("click", function() {
    $(".legendLinear").addClass("hidden");
    setBestWorst();
});

$("#explore").on("click", function() {
    $(".legendLinear").removeClass("hidden");

    if ($("#provincial_radio").attr("checked") == "checked") {
        setColors("../json/provinceCrime.json", "provinces");
    }
    else {
        setColors("../json/stationCrime.json", "stations");
    }
});

