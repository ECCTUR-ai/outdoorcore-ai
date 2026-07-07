import React, { useEffect, useRef, useState } from 'react';
import { useTheme } from '@/context/ThemeContext';
import { AdvertisingSpace } from '@/data/advertisingSpaces';
import { spaceRepository } from '@/repositories';
import { Radio, Globe } from 'lucide-react';

interface AdvertisingSpaceMapProps {
  selectedCode: string;
  onSelectCode: (code: string) => void;
  spaces?: AdvertisingSpace[];
}

const darkMapStyle = [
  { "elementType": "geometry", "stylers": [{ "color": "#0B1020" }] },
  { "elementType": "labels.text.stroke", "stylers": [{ "color": "#0B1020" }] },
  { "elementType": "labels.text.fill", "stylers": [{ "color": "#707b93" }] },
  { "featureType": "administrative", "elementType": "geometry", "stylers": [{ "visibility": "off" }] },
  { "featureType": "poi", "stylers": [{ "visibility": "off" }] },
  { "featureType": "road", "elementType": "geometry", "stylers": [{ "color": "#12192B" }] },
  { "featureType": "road", "elementType": "geometry.stroke", "stylers": [{ "color": "rgba(255,255,255,0.06)" }] },
  { "featureType": "road", "elementType": "labels.text.fill", "stylers": [{ "color": "#707b93" }] },
  { "featureType": "transit", "stylers": [{ "visibility": "off" }] },
  { "featureType": "water", "elementType": "geometry", "stylers": [{ "color": "#060913" }] }
];

export function AdvertisingSpaceMap({ selectedCode, onSelectCode, spaces }: AdvertisingSpaceMapProps) {
  const { resolvedTheme } = useTheme();
  const mapRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const [mapInstance, setMapInstance] = useState<any>(null);
  const [markers, setMarkers] = useState<any[]>([]);
  const [trafficLayer, setTrafficLayer] = useState<any>(null);
  const [isTrafficActive, setIsTrafficActive] = useState(false);
  const [isEarthView, setIsEarthView] = useState(false);
  const [zoomLevel, setZoomLevel] = useState(11);
  const [currentBounds, setCurrentBounds] = useState<any>(null);
  const [googleReady, setGoogleReady] = useState(false);

  // Load Google Maps API script dynamically if not present
  useEffect(() => {
    if ((window as any).google) {
      setGoogleReady(true);
      return;
    }

    const scriptId = 'google-maps-script';
    let script = document.getElementById(scriptId) as HTMLScriptElement;
    if (!script) {
      script = document.createElement('script');
      script.id = scriptId;
      script.src = `https://maps.googleapis.com/maps/api/js?libraries=places`;
      script.async = true;
      script.defer = true;
      document.head.appendChild(script);
    }

    const handleLoad = () => setGoogleReady(true);
    script.addEventListener('load', handleLoad);

    return () => {
      script.removeEventListener('load', handleLoad);
    };
  }, []);

  // Initialize Map
  useEffect(() => {
    if (!googleReady || !mapRef.current || mapInstance) return;

    const google = (window as any).google;
    const initialMap = new google.maps.Map(mapRef.current, {
      center: { lat: 41.0082, lng: 28.9784 }, // İstanbul Center
      zoom: 11,
      mapTypeId: 'roadmap',
      disableDefaultUI: true,
      zoomControl: true,
      styles: resolvedTheme === 'dark' ? darkMapStyle : []
    });

    const traffic = new google.maps.TrafficLayer();
    setTrafficLayer(traffic);

    // Track zoom and bounds to recalculate clusters dynamically
    initialMap.addListener('zoom_changed', () => {
      setZoomLevel(initialMap.getZoom() || 11);
    });

    initialMap.addListener('bounds_changed', () => {
      setCurrentBounds(initialMap.getBounds() || null);
    });

    setMapInstance(initialMap);

    // Setup autocomplete
    if (searchInputRef.current) {
      const autocomplete = new google.maps.places.Autocomplete(searchInputRef.current, {
        types: ['geocode', 'establishment']
      });
      autocomplete.bindTo('bounds', initialMap);
      autocomplete.addListener('place_changed', () => {
        const place = autocomplete.getPlace();
        if (place.geometry && place.geometry.location) {
          initialMap.setCenter(place.geometry.location);
          initialMap.setZoom(14);
        }
      });
    }
  }, [googleReady, mapInstance]);

  // Update theme styling
  useEffect(() => {
    if (mapInstance && (window as any).google) {
      mapInstance.setOptions({
        styles: resolvedTheme === 'dark' ? darkMapStyle : []
      });
    }
  }, [resolvedTheme, mapInstance]);

  // Grid-based clustering logic
  const clusterMarkers = (
    spacesList: AdvertisingSpace[],
    zoom: number,
    bounds: any
  ) => {
    const google = (window as any).google;
    if (zoom >= 14 || !bounds) {
      return spacesList.map(s => ({
        isCluster: false,
        space: s,
        lat: s.latitude!,
        lng: s.longitude!
      }));
    }

    const ne = bounds.getNorthEast();
    const sw = bounds.getSouthWest();
    const latSpan = ne.lat() - sw.lat();
    const lngSpan = ne.lng() - sw.lng();

    const gridSize = Math.max(4, Math.min(10, zoom));
    const latStep = latSpan / gridSize;
    const lngStep = lngSpan / gridSize;

    const cells: { [key: string]: AdvertisingSpace[] } = {};

    spacesList.forEach(s => {
      if (!s.latitude || !s.longitude) return;
      if (!bounds.contains(new google.maps.LatLng(s.latitude, s.longitude))) return;

      const latIndex = Math.floor((s.latitude - sw.lat()) / latStep);
      const lngIndex = Math.floor((s.longitude - sw.lng()) / lngStep);
      const cellKey = `${latIndex}_${lngIndex}`;

      if (!cells[cellKey]) {
        cells[cellKey] = [];
      }
      cells[cellKey].push(s);
    });

    const results: any[] = [];
    Object.keys(cells).forEach(key => {
      const cellSpaces = cells[key];
      if (cellSpaces.length === 1) {
        results.push({
          isCluster: false,
          space: cellSpaces[0],
          lat: cellSpaces[0].latitude!,
          lng: cellSpaces[0].longitude!
        });
      } else {
        let sumLat = 0;
        let sumLng = 0;
        cellSpaces.forEach(s => {
          sumLat += s.latitude!;
          sumLng += s.longitude!;
        });
        results.push({
          isCluster: true,
          spaces: cellSpaces,
          lat: sumLat / cellSpaces.length,
          lng: sumLng / cellSpaces.length,
          count: cellSpaces.length
        });
      }
    });

    return results;
  };

  // Render clusters and markers
  useEffect(() => {
    if (!mapInstance || !(window as any).google) return;

    const google = (window as any).google;

    // Clear old markers
    markers.forEach(m => m.setMap(null));

    // Get list of spaces with coordinates
    const list = (spaces || spaceRepository.getAllSync()).filter(s => s.latitude && s.longitude);

    // Compute cluster/individual items
    const computedItems = clusterMarkers(list, zoomLevel, currentBounds);

    const newMarkersList: any[] = [];
    const infoWindow = new google.maps.InfoWindow({
      disableAutoPan: true
    });

    computedItems.forEach(item => {
      if (item.isCluster) {
        const clusterMarker = new google.maps.Marker({
          position: { lat: item.lat, lng: item.lng },
          map: mapInstance,
          label: {
            text: String(item.count),
            color: '#FFFFFF',
            fontSize: '9px',
            fontWeight: '900'
          },
          icon: {
            path: google.maps.SymbolPath.CIRCLE,
            fillColor: '#3B82F6',
            fillOpacity: 0.95,
            strokeColor: '#FFFFFF',
            strokeWeight: 1.5,
            scale: 14 + Math.min(8, item.count / 2)
          }
        });

        clusterMarker.addListener('click', () => {
          mapInstance.setCenter({ lat: item.lat, lng: item.lng });
          mapInstance.setZoom(mapInstance.getZoom() + 2);
        });

        newMarkersList.push(clusterMarker);
      } else {
        const space = item.space;
        let color = '#FFFFFF';
        if (space.status === 'bos') color = '#10B981';
        else if (space.status === 'teklif') color = '#F59E0B';
        else if (space.status === 'dolu') color = '#EF4444';

        const isSelected = selectedCode === space.code;

        const marker = new google.maps.Marker({
          position: { lat: item.lat, lng: item.lng },
          map: mapInstance,
          title: space.code,
          animation: isSelected ? google.maps.Animation.BOUNCE : null,
          icon: {
            path: google.maps.SymbolPath.CIRCLE,
            fillColor: color,
            fillOpacity: 1.0,
            strokeColor: isSelected ? '#FFFFFF' : 'rgba(255,255,255,0.3)',
            strokeWeight: isSelected ? 3.0 : 1.0,
            scale: isSelected ? 11 : 7.5
          }
        });

        const statusLabel = 
          space.status === 'bos' ? 'Müsait' : 
          space.status === 'teklif' ? 'Opsiyon' : 
          space.status === 'dolu' ? 'Dolu' : 'Bakımda';

        const statusColorHex = 
          space.status === 'bos' ? '#10B981' : 
          space.status === 'teklif' ? '#F59E0B' : 
          space.status === 'dolu' ? '#EF4444' : '#707b93';

        marker.addListener('mouseover', () => {
          const hoverHtml = `
            <div style="background: #12192B; border: 1px solid rgba(255,255,255,0.08); border-radius: 12px; padding: 10px 14px; color: #FFFFFF; font-family: Inter, system-ui, sans-serif; font-size: 10.5px; box-shadow: 0 12px 30px rgba(0,0,0,0.5); min-width: 160px; pointer-events: none;">
              <div style="font-weight: 900; margin-bottom: 2px; color: #3B82F6; font-size: 11px;">${space.code}</div>
              <div style="font-weight: 700; margin-bottom: 6px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">${space.name}</div>
              <div style="display: flex; justify-content: space-between; margin-bottom: 3px; border-top: 1px solid rgba(255,255,255,0.06); padding-top: 4px;">
                <span style="color: rgba(255,255,255,0.6); font-size: 9px; font-weight: 600; text-transform: uppercase;">Durum:</span>
                <span style="font-weight: 800; color: ${statusColorHex}; font-size: 9px; text-transform: uppercase;">${statusLabel}</span>
              </div>
              <div style="display: flex; justify-content: space-between;">
                <span style="color: rgba(255,255,255,0.6); font-size: 9px; font-weight: 600; text-transform: uppercase;">Fiyat:</span>
                <span style="font-weight: 800; color: #3B82F6; font-size: 9px;">${space.price}</span>
              </div>
            </div>
          `;
          infoWindow.setContent(hoverHtml);
          infoWindow.open(mapInstance, marker);
        });

        marker.addListener('mouseout', () => {
          infoWindow.close();
        });

        marker.addListener('click', () => {
          onSelectCode(space.code);
        });

        newMarkersList.push(marker);
      }
    });

    setMarkers(newMarkersList);
  }, [spaces, selectedCode, mapInstance, zoomLevel, currentBounds]);

  // Clean markers on unmount
  useEffect(() => {
    return () => {
      markers.forEach(m => m.setMap(null));
    };
  }, [markers]);

  return (
    <div className="relative w-full h-[500px] rounded-2xl bg-[#090d1f] border border-white/5 overflow-hidden animate-fade-in">
      {/* Autocomplete Input Search */}
      <div className="absolute top-4 left-4 z-10 w-64">
        <input
          ref={searchInputRef}
          type="text"
          placeholder="Konum veya Reklam Alanı Ara..."
          className="w-full bg-[#12192B]/90 border border-white/8 backdrop-blur-md px-3.5 py-2 rounded-xl text-[10px] font-black text-white placeholder-slate-400 focus:outline-none focus:border-blue-500 shadow-xl"
        />
      </div>

      {/* Right Map Layers Toolbar */}
      <div className="absolute top-4 right-4 z-10 flex gap-2">
        <button
          onClick={() => {
            if (trafficLayer) {
              if (isTrafficActive) {
                trafficLayer.setMap(null);
              } else {
                trafficLayer.setMap(mapInstance);
              }
              setIsTrafficActive(!isTrafficActive);
            }
          }}
          className={`px-3 py-2 rounded-xl text-[9px] font-black uppercase tracking-wider flex items-center gap-1.5 backdrop-blur-md shadow-xl transition-all cursor-pointer border ${
            isTrafficActive
              ? 'bg-blue-500/20 text-blue-400 border-blue-500/30 font-black'
              : 'bg-[#12192B]/90 text-slate-300 border-white/8 hover:text-white font-bold'
          }`}
        >
          <Radio size={11} className={isTrafficActive ? 'animate-pulse' : ''} />
          <span>Trafik</span>
        </button>

        <button
          onClick={() => {
            const nextType = isEarthView ? 'roadmap' : 'hybrid';
            if (mapInstance) {
              mapInstance.setMapTypeId(nextType);
            }
            setIsEarthView(!isEarthView);
          }}
          className="px-3 py-2 rounded-xl text-[9px] font-black uppercase tracking-wider flex items-center gap-1.5 bg-[#12192B]/90 text-slate-300 border border-white/8 hover:text-white backdrop-blur-md shadow-xl transition-all cursor-pointer"
        >
          <Globe size={11} />
          <span>{isEarthView ? 'Harita' : 'Uydu'}</span>
        </button>
      </div>

      {/* Main Google Map Node */}
      <div ref={mapRef} className="w-full h-full" />
    </div>
  );
}
