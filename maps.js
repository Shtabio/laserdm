ymaps.ready(init);

function init() {

    const map1 = new ymaps.Map("map1", {
        center: [60.030182, 30.206048],
        zoom: 16
    });

    map1.behaviors.enable("scrollZoom");

    map1.geoObjects.add(
        new ymaps.Placemark([60.030182, 30.206048])
    );

    const map2 = new ymaps.Map("map2", {
        center: [59.985233, 30.310603],
        zoom: 16
    });

    map2.behaviors.enable("scrollZoom");

    map2.geoObjects.add(
        new ymaps.Placemark([59.985233, 30.310603])
    );
}
