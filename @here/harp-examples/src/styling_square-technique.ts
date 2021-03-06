/*
 * Copyright (C) 2017-2020 HERE Europe B.V.
 * Licensed under Apache 2.0, see full license in LICENSE
 * SPDX-License-Identifier: Apache-2.0
 */
import { GeoCoordinates } from "@here/harp-geoutils";
import { MapControls, MapControlsUI } from "@here/harp-map-controls";
import { CopyrightElementHandler, MapView } from "@here/harp-mapview";
import { OmvDataSource } from "@here/harp-omv-datasource";

import { apikey } from "../config";

/**
 * A small example using the {@links SquaresTechnique} to add a pink suqare to
 * each place in the map.
 *
 * The {@links MapView} will be initialized with a theme that extends the
 * default theme with a style that overrides the places with a square
 * ```typescript
 * [[include:squares_technique_example.ts]]
 * ```
 */
export namespace SquaresTechniqueExample {
    // Create a new MapView for the HTMLCanvasElement of the given id.
    function initializeMapView(id: string): MapView {
        const canvas = document.getElementById(id) as HTMLCanvasElement;

        // Look at New York.
        const NY = new GeoCoordinates(40.707, -74.01);
        const map = new MapView({
            canvas,
            // snippet:squares_technique_example.ts
            theme: {
                extends: "resources/berlin_tilezen_base.json",
                styles: {
                    tilezen: [
                        {
                            layer: "places",
                            technique: "squares",
                            when: ["==", ["geometry-type"], "Point"],
                            color: "#ff00ff",
                            size: 500
                        }
                    ]
                }
            },
            // end:squares_technique_example.ts
            target: NY,
            tilt: 50,
            heading: -20,
            zoomLevel: 15.1
        });

        CopyrightElementHandler.install("copyrightNotice", map);

        const mapControls = new MapControls(map);
        mapControls.maxTiltAngle = 50;

        const ui = new MapControlsUI(mapControls, { zoomLevel: "input" });
        canvas.parentElement!.appendChild(ui.domElement);

        map.resize(window.innerWidth, window.innerHeight);

        window.addEventListener("resize", () => {
            map.resize(window.innerWidth, window.innerHeight);
        });

        addOmvDataSource(map);

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

    export const mapView = initializeMapView("mapCanvas");
}
