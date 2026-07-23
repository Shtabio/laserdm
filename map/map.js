ymaps.ready(init);

function init() {

    const map1 = new ymaps.Map("map1", {
        center: [59.999, 30.233],
        zoom: 16
    });

    map1.behaviors.enable("scrollZoom");

    map1.geoObjects.add(
        new ymaps.Placemark([59.999, 30.233])
    );

    const map2 = new ymaps.Map("map2", {
        center: [59.970, 30.312],
        zoom: 16
    });

    map2.behaviors.enable("scrollZoom");

    map2.geoObjects.add(
        new ymaps.Placemark([59.970, 30.312])
    );
}
