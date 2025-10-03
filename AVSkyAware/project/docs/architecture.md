# Architecture Overview

## Ingest & Convert
- .tif placed in images/ → libvips dzsave builds DZI pyramid in dzi/<name>/. [attached_file:72]

## Delivery
- Frontend requests .dzi; OpenSeadragon fetches visible tiles; static serving enables CDN caching. [attached_file:72]

## Client
- Gallery (ID + friendly name); modal deep‑zoom with controls (zoom/home/fullscreen); optional AI describe. [attached_file:72]

## Observability
- Convert logs and timings; preview generation logs; simple health checks. [attached_file:72]

