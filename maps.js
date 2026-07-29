ymaps.ready(init);

function init() {

    const map1 = new ymaps.Map("map1", {
        center: [30.206078, 60.030197],
        zoom: 21
    });

    map1.behaviors.enable("scrollZoom");

    map1.geoObjects.add(
        new ymaps.Placemark([30.206078, 60.030197])
    );

    const map2 = new ymaps.Map("map2", {
        center: [30.205960, 60.029508],
        zoom: 21
    });

    map2.behaviors.enable("scrollZoom");

    map2.geoObjects.add(
        new ymaps.Placemark([30.205960, 60.029508])
    );
}
