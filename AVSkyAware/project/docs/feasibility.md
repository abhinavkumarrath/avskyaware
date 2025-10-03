# Feasibility

## Stack
- Node/Express, libvips for TIFF→DZI, OpenSeadragon in the browser. [attached_file:72]

## Performance
- Streams only visible tiles; preview JPGs speed gallery load; caching reduces CPU/RAM churn. [attached_file:72]

## Scalability
- CDN‑ready static tiles; stateless server behind a load balancer; batch precompute for exhibits. [attached_file:72]

## Ops
- Clear folders (images/, dzi/, public/); minimal deps; simple deploy on local or cloud. [attached_file:72]

