/*
 * Copyright (C) 2017-2020 HERE Europe B.V.
 * Licensed under Apache 2.0, see full license in LICENSE
 * SPDX-License-Identifier: Apache-2.0
 */
import {
    FeaturesDataSource,
    MapViewFeature,
    MapViewMultiPolygonFeature
} from "@here/harp-features-datasource";
import { GeoCoordinates, mercatorProjection } from "@here/harp-geoutils";
import { MapControls, MapControlsUI } from "@here/harp-map-controls";
import { CopyrightElementHandler, MapView } from "@here/harp-mapview";
import { OmvDataSource } from "@here/harp-omv-datasource";

import { apikey } from "../config";
import { COUNTRIES } from "../resources/countries";

export namespace OutlineExample {
    // Create a new MapView for the HTMLCanvasElement of the given id.
    function initializeMapView(id: string): MapView {
        const canvas = document.getElementById(id) as HTMLCanvasElement;

        // Look at BERLIN
        const BERLIN = new GeoCoordinates(52.5186234, 13.373993);
        const map = new MapView({
            canvas,
            projection: mercatorProjection,
            // snippet:lines_technique_example.ts
            theme: {
                extends: "resources/berlin_tilezen_night_reduced.json",
                styles: {
                    geojson: [
                        {
                            when: ["all", ["==", ["geometry-type"], "Polygon"]],
                            technique: "fill",
                            renderOrder: 10003,
                            color: ["get", "color"], // "#77ccff",
                            lineWidth: 1,
                            lineColor: "#ff0000",
                            enabled: ["==", "on", ["get", "status", ["dynamic-properties"]]]
                        }
                    ]
                }
            },
            target: BERLIN,
            zoomLevel: 8,
            tilt: 45,
            heading: -80
        });
        map.renderLabels = false;

        CopyrightElementHandler.install("copyrightNotice", map);

        const mapControls = new MapControls(map);
        mapControls.maxTiltAngle = 50;

        const ui = new MapControlsUI(mapControls, { zoomLevel: "input" });
        canvas.parentElement!.appendChild(ui.domElement);

        map.resize(window.innerWidth, window.innerHeight);

        window.addEventListener("resize", () => {
            map.resize(window.innerWidth, window.innerHeight);
        });

        // addOmvDataSource(map);
        const featureList = createFeatureList();
        if (featureList !== undefined) {
            //@ts-ignore
            addFeaturesDataSource(map, featureList);
        }

        let flag = false;
        map.canvas.addEventListener("click", event => {
            if (flag === true) {
                console.log("enable germany geojson");
                map.setDynamicProperty("status", "on");
                flag = false;
            } else {
                console.log("disable germany geojson");
                map.setDynamicProperty("status", "off");
                flag = true;
            }
        });

        map.setDynamicProperty("status", "on");

        return map;
    }

    function addOmvDataSource(map: MapView) {
        const omvDataSource = new OmvDataSource({
            baseUrl: "https://vector.hereapi.com/v2/vectortiles/base/mc",
            authenticationCode: apikey
        });

        map.addDataSource(omvDataSource);

        return map;
    }

    function createFeatureList(): [MapViewFeature?] {
        const featuresList: [MapViewFeature?] = [];
        const polygonFeature = new MapViewMultiPolygonFeature(COUNTRIES.germany, {
            name: "germany",
            height: 10000,
            color: "#ffff00"
        });
        featuresList.push(polygonFeature);
        return featuresList;
    }

    function addFeaturesDataSource(map: MapView, featureList: [MapViewFeature]) {
        const featuresDataSource = new FeaturesDataSource({
            name: "featureDataSource",
            styleSetName: "geojson",
            features: featureList,
            gatherFeatureAttributes: true
        });
        map.addDataSource(featuresDataSource);
    }

    export const mapView = initializeMapView("mapCanvas");
}
