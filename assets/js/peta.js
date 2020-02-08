
$(document).ready(function()
{
	$('#resetme').click(function(){
		window.location.reload(false);
	});
});


function getBaseLayers(peta, access_token)
{
	//Menampilkan BaseLayers Peta
	var defaultLayer = L.tileLayer.provider('OpenStreetMap.Mapnik').addTo(peta);

	var baseLayers = {
		'OpenStreetMap': defaultLayer,
		'OpenStreetMap H.O.T.': L.tileLayer.provider('OpenStreetMap.HOT'),
		'Mapbox Streets' : L.tileLayer('https://api.mapbox.com/v4/mapbox.streets/{z}/{x}/{y}@2x.png?access_token='+access_token, {attribution: '<a href="https://www.mapbox.com/about/maps">© Mapbox</a> <a href="https://openstreetmap.org/copyright">© OpenStreetMap</a> | <a href="https://mapbox.com/map-feedback/">Improve this map</a>'}),
		'Mapbox Outdoors' : L.tileLayer('https://api.mapbox.com/v4/mapbox.outdoors/{z}/{x}/{y}@2x.png?access_token='+access_token, {attribution: '<a href="https://www.mapbox.com/about/maps">© Mapbox</a> <a href="https://openstreetmap.org/copyright">© OpenStreetMap</a> | <a href="https://mapbox.com/map-feedback/">Improve this map</a>'}),
		'Mapbox Streets Satellite' : L.tileLayer('https://api.mapbox.com/v4/mapbox.streets-satellite/{z}/{x}/{y}@2x.png?access_token='+access_token, {attribution: '<a href="https://www.mapbox.com/about/maps">© Mapbox</a> <a href="https://openstreetmap.org/copyright">© OpenStreetMap</a> | <a href="https://mapbox.com/map-feedback/">Improve this map</a>'}),
	};
	return baseLayers;
}

function poligonWil(marker)
{
	var poligon_wil = L.geoJSON(turf.featureCollection(marker), {
    pmIgnore: true,
    onEachFeature: function (feature, layer) {
      layer.bindPopup(feature.properties.content);
      layer.bindTooltip(feature.properties.content);
    },
    style: function(feature)
    {
      if (feature.properties.style)
      {
        return feature.properties.style;
      }
    },
    pointToLayer: function (feature, latlng)
    {
      if (feature.properties.style)
      {
        return L.marker(latlng, {icon: feature.properties.style});
      }
      else
      return L.marker(latlng);
    }
  });
	return poligon_wil;
}

function overlayWil(marker_desa, marker_dusun, marker_rw, marker_rt)
{
  var poligon_wil_desa = poligonWil(marker_desa);
  var poligon_wil_dusun = poligonWil(marker_dusun);
  var poligon_wil_rw = poligonWil(marker_rw);
  var poligon_wil_rt = poligonWil(marker_rt);
  var overlayLayers = {
    'Peta Wilayah Desa': poligon_wil_desa,
    'Peta Wilayah Dusun': poligon_wil_dusun,
    'Peta Wilayah RW': poligon_wil_rw,
    'Peta Wilayah RT': poligon_wil_rt
  };
  return overlayLayers;
}

function getLatLong(x, y)
{
  var hasil;
  if (x == 'Rectangle' || x == 'Line' || x == 'Poly')
  {
    hasil = JSON.stringify(y._latlngs);
  }
  else
  {
    hasil = JSON.stringify(y._latlng);
  }
  hasil = hasil.replace(/\}/g, ']').replace(/(\{)/g, '[').replace(/(\"lat\"\:|\"lng\"\:)/g, '');
  return hasil;
}

function stylePolygonDesa()
{
	var style_polygon = {
		stroke: true,
		color: '#FF0000',
		opacity: 1,
		weight: 2,
		fillColor: '#8888dd',
		fillOpacity: 0.5
	};
	return style_polygon;
}

function stylePolygonDusun()
{
	var style_polygon = {
		stroke: true,
		color: '#FF0000',
		opacity: 1,
		weight: 2,
		fillColor: '#FFFF00',
		fillOpacity: 0.5
	};
	return style_polygon;
}

function stylePolygonRw()
{
	var style_polygon = {
		stroke: true,
		color: '#FF0000',
		opacity: 1,
		weight: 2,
		fillColor: '#8888dd',
		fillOpacity: 0.5
	};
	return style_polygon;
}

function stylePolygonRt()
{
	var style_polygon = {
		stroke: true,
		color: '#FF0000',
		opacity: 1,
		weight: 2,
		fillColor: '#008000',
		fillOpacity: 0.5,
	};
	return style_polygon;
}

function stylePointLogo(url)
{
	var style = {
			iconSize: [32, 37],
			iconAnchor: [16, 37],
			popupAnchor: [0, -28],
			iconUrl: url
	};
	return style;
}

function editToolbar()
{
	var options =
	{
		position: 'topright', // toolbar position, options are 'topleft', 'topright', 'bottomleft', 'bottomright'
		drawMarker: false, // adds button to draw markers
		drawCircleMarker: false, // adds button to draw markers
		drawPolyline: false, // adds button to draw a polyline
		drawRectangle: false, // adds button to draw a rectangle
		drawPolygon: true, // adds button to draw a polygon
		drawCircle: false, // adds button to draw a cricle
		cutPolygon: false, // adds button to cut a hole in a polygon
		editMode: true, // adds button to toggle edit mode for all layers
		removalMode: true, // adds a button to remove layers
	};
	return options;
}

function styleGpx()
{
	var style = {
		color: 'red',
		opacity: 1.0,
		fillOpacity: 1.0,
		weight: 2,
		clickable: true
	};
	return style;
}

function eximGpx(layerpeta)
{
	var control = L.Control.fileLayerLoad({
		addToMap: false,
		formats: [
			'.gpx',
			'.geojson'
		],
		fitBounds: true,
		layerOptions: {
			style: styleGpx(),
			pointToLayer: function (data, latlng) {
				return L.circleMarker(
					latlng,
					{ style: styleGpx() }
				);
			},

		}
	});
	control.addTo(layerpeta);

	control.loader.on('data:loaded', function (e) {
		var type = e.layerType;
		var layer = e.layer;
		var coords=[];
		var geojson = layer.toGeoJSON();
		var options = {tolerance: 0.0001, highQuality: false};
		var simplified = turf.simplify(geojson, options);
		var shape_for_db = JSON.stringify(geojson);
		var gpxData = togpx(JSON.parse(shape_for_db));

		$("#exportGPX").on('click', function (event) {
			data = 'data:text/xml;charset=utf-8,' + encodeURIComponent(gpxData);

			$(this).attr({
				'href': data,
				'target': '_blank'
			});

		});

		var polygon =
		//L.geoJson(JSON.parse(shape_for_db), { //jika ingin koordinat tidak dipotong/simplified
		L.geoJson(simplified, {
			pointToLayer: function (feature, latlng) {
				return L.circleMarker(latlng, { style: style });
			},
			onEachFeature: function (feature, layer) {
				coords.push(feature.geometry.coordinates);
			},

		}).addTo(layerpeta);

		var jml = coords[0].length;
		coords[0].push(coords[0][0]);
		for (var x = 0; x < jml; x++)
		{
			coords[0][x].reverse();
		}

		polygon.on('pm:edit', function(e)
		{
			document.getElementById('path').value = JSON.stringify(coords);
			document.getElementById('zoom').value = layerpeta.getZoom();
		});

		document.getElementById('path').value = JSON.stringify(coords);
		document.getElementById('zoom').value = layerpeta.getZoom();
		layerpeta.fitBounds(polygon.getBounds());
	});
	return control;
}

function geoLocation(layerpeta)
{
	var lc = L.control.locate({
		icon: 'fa fa-map-marker',
		locateOptions: {enableHighAccuracy: true},
		strings: {
				title: "Lokasi Saya",
				popup: "Anda berada di sekitar {distance} {unit} dari titik ini"
		}

	}).addTo(layerpeta);

	layerpeta.on('locationfound', function(e) {
			layerpeta.setView(e.latlng)
	});

	layerpeta.on('startfollowing', function() {
		layerpeta.on('dragstart', lc._stopFollowing, lc);
	}).on('stopfollowing', function() {
		layerpeta.off('dragstart', lc._stopFollowing, lc);
	});
	return lc;
}

function hapusPeta(layerpeta)
{
	layerpeta.on('pm:globalremovalmodetoggled', function(e)
	{
		document.getElementById('path').value = '';
	});
	return hapusPeta;
}

function updateZoom(layerpeta)
{
	layerpeta.on('zoomend', function(e){
	document.getElementById('zoom').value = layerpeta.getZoom();
	});
	return updateZoom;
}

function addPetaPoly(layerpeta)
{
	layerpeta.on('pm:create', function(e)
	{
		var type = e.layerType;
		var layer = e.layer;
		var latLngs;

		if (type === 'circle') {
			latLngs = layer.getLatLng();
		}
		else
		latLngs = layer.getLatLngs();

		var p = latLngs;
		var polygon = L.polygon(p, { color: '#A9AAAA', weight: 4, opacity: 1 }).addTo(layerpeta);

		polygon.on('pm:edit', function(e)
		{
			document.getElementById('path').value = getLatLong('Poly', e.target).toString();
			document.getElementById('zoom').value = peta_wilayah.getZoom();
		});

		layerpeta.fitBounds(polygon.getBounds());

		// set value setelah create polygon
		document.getElementById('path').value = getLatLong('Poly', layer).toString();
		document.getElementById('zoom').value = layerpeta.getZoom();
	});
	return addPetaPoly;
}

function showCurrentPeta(wilayah, layerpeta)
{
	var daerah_wilayah = wilayah;
	daerah_wilayah[0].push(daerah_wilayah[0][0]);
	var poligon_wilayah = L.polygon(wilayah).addTo(layerpeta);
	poligon_wilayah.on('pm:edit', function(e)
	{
		document.getElementById('path').value = getLatLong('Poly', e.target).toString();
		document.getElementById('zoom').value = layerpeta.getZoom();
	})

	var layer = poligon_wilayah;
	var geojson = layer.toGeoJSON();
	var shape_for_db = JSON.stringify(geojson);
	var gpxData = togpx(JSON.parse(shape_for_db));

	$("#exportGPX").on('click', function (event) {
		data = 'data:text/xml;charset=utf-8,' + encodeURIComponent(gpxData);
		$(this).attr({
			'href': data,
			'target': '_blank'
		});
	});

	layerpeta.panTo(poligon_wilayah.getBounds().getCenter());

	// set value setelah create polygon
	document.getElementById('path').value = getLatLong('Poly', layer).toString();
	document.getElementById('zoom').value = layerpeta.getZoom();

	return showCurrentPeta;
}
