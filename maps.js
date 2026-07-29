ymaps.ready(init);

function init() {

    const map1 = new ymaps.Map("map1", {
        center: [60.029508, 30.205959],
        zoom: 16
    });

    map1.behaviors.enable("scrollZoom");

    map1.geoObjects.add(
        new ymaps.Placemark([60.029508, 30.205959])
    );

    const map2 = new ymaps.Map("map2", {
        center: [30.205960, 60.029508],
        zoom: 16
    });

    map2.behaviors.enable("scrollZoom");

    map2.geoObjects.add(
        new ymaps.Placemark([30.205960, 60.029508])
    );
}
