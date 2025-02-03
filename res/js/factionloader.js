$("#clearPoints").click(function(){
    $(".point").remove();
});
function LoadFactions(){
    $("#actBox").hide();
    __t = -1;
    __f = -1;
    $("#factlist").empty();
    $("polygon").remove();
    $(".point").remove();
    $(".captionzzz").remove();
    $.get('engine.json.php', function(data){
        var f = jQuery.parseJSON(data);
        f.factions.forEach(function(faction){
            _factions[faction.id] = faction;
            $("#factlist").append("<li class=\"fact fact"+faction.id+"\"><div class=\"factSquare\" style=\"background-color: #" + faction.color + "\"></div> " + faction.name + "<span class=\"factid\">"+faction.id+"</span></li>");
            var i = 0;
            faction.turfs.forEach(function(points){
                var turfSVG = makeSVG('polygon', {'class': faction.id, 'name': i, 'points': points, stroke: 'white', 'stroke-width': 2, fill: '#' + faction.color, opacity: 0.3});
                var turf = $(turfSVG).appendTo("#_mapa");
                _factions[faction.id].turfPolygon[i] = turf;
                var fSize = 0.5;
                if(faction.dimensions[i][0] > 200){
                    fSize = 1.1;
                }else if(faction.dimensions[i][0] > 90){
                    fSize = 0.8;
                }
                $("<div>"+faction.name+"</div>").css({
                    'position': 'absolute',
                    'top': faction.turfcenter[i][1] - 10,
                    'left': faction.limits[i].minx + 'px',
                    'width': faction.limits[i].maxx - faction.limits[i].minx + 'px',
                    'text-align': 'center',
                    'font-size': fSize + 'em',
                    'font-weight': 'bold',
                    'color': 'white',
                    'text-transform': 'uppercase',
                    'font-family': 'tahoma',
                    'pointer-events': 'none'
                }).addClass('captionzzz').appendTo("#map_images");
                i++;
            });
        })
    }).done(function(){
        RefreshPolygonList();
    });
}

function RefreshPolygonList(){
    _factions.forEach(function(_f){
        $(".polylist_" + _f.id).remove();
        if(_f.turfPolygon.length > 0){
            $(".fact"+_f.id).after("<ul class=\"polylist polylist_"+_f.id+"\" style='display:none;'></ul>");
            var i = 0;
            _f.turfPolygon.forEach(function(poly){
                i++;
                $(".polylist_"+_f.id).append("<li class=\"turfinlist\">Turf #<span class=\"turfid\">" + i + "</span></li>");
            })
        }
    });
}

$(document).on("click", ".fact", function(){
    var fid = $(this).children(".factid").text();
    selectedFaction = fid;
    $(".fact").css("background-color", "rgba(0, 0, 0, 0.0)");
    $(this).css("background-color", "rgba(0, 0, 0, 0.0)");
});

$("#addfact_color").keyup(function(){
    $("#previewCol").css("background-color", "#" + $(this).val());
});


LoadFactions();

/*$("#_mapa").mousemove( function(event){
    $("#map_coords").text('Cursor position: X = ' + (($(this).offset().left + 3000) * (-1) + event.pageX) + ', Y = ' + ($(this).offset().top + 3000 - event.pageY));
    mX = ($(this).offset().left) * -1 + event.pageX;
    mY = ($(this).offset().top) * -1 + event.pageY;
});*/

$(function(){
    $(document).on("mouseenter", "polygon", function(){
        $(this).css({"opacity": "0.5", "cursor": "pointer"});
    }).on("mouseout", "polygon", function(){
        $(this).css({"opacity": "0.3", "cursor": "pointer"});
    });

});

$(document).on("click", ".turfinlist", function(){
    var _f = $(this).parent().prev().children(".factid").text();
    var _t = $(this).children(".turfid").text();
    scrMapTo(_factions[_f].turfcenter[_t - 1][0], _factions[_f].turfcenter[_t - 1][1]);
})

$(document).on("click", "polygon", function(e){
    var _f = $(this).attr('class');
    var _t = $(this).attr('name');
    __f = _f;
    __t = _t;
    if(_factions[_f].thread.length > 0){
        var _box = $("#actBox");
        _box.css({
            'display': 'block',
            'left': e.clientX - $("#_mapa").offset().left + 10 + 'px',
            'top': e.clientY - $("#_mapa").offset().top + 'px'
        });
        $("#actShowThread").show();
        $("#actShowThread").attr('href', _factions[_f].thread);
    }
});

$("#_mapa").click(function(){
    if($("polygon:hover").length == 0){
        if($("#actBox").css('display') != 'none'){
            __t = -1;
            __f = -1;
            return $("#actBox").hide();
        }
    }
});


$(document).on("click", ".fact", function(e){
    $(this).next(".polylist:first").toggle();
})