import { Component, OnDestroy, OnInit } from '@angular/core';
import L from 'leaflet';
import { environment as env } from '../../../../../environments/environment';
import { EquipmentsState } from '../../../../services/states/equipments.state';
import { map } from 'rxjs/operators';
import { EquipmentPositionHistory, Position } from '../../../../models/equipment-position-history';
import { EquipmentStateHistory } from '../../../../models/equipment-state-history';


@Component({
  selector: 'app-map-equipment',
  standalone: true,
  imports: [],
  templateUrl: './map-equipment.component.html',
  styleUrl: './map-equipment.component.scss'
})
export class MapEquipmentComponent implements OnInit, OnDestroy {

  private map!: L.Map;
  private centroid: L.LatLngExpression = [-19.126536, -45.947756];

  public pathEquipmentData!: any;

  constructor(private state: EquipmentsState) { }

  ngOnInit(): void {

    this.state.equipmentPosition$
      .pipe(map((item) => item.positions))
      .subscribe((result) => {

        this.pathEquipmentData = result;

        if(this.map)this.map.remove();

        this.initMap();

      });

  }

  initMap() {

    this.map = L.map('map').setView(this.centroid, 5);

    const tiles = L.tileLayer(env.MAP_LAYER, {
      maxZoom: 18,
      minZoom: 10,
      attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    });

    const marker = L.marker(this.centroid);

    const circle = L.circle(this.centroid, {
      color: 'red',
      fillColor: '#f03',
      fillOpacity: 0.5,
      radius: 500
    });

    // Define a cor e o estilo da linha
    const pathStyle = {
      color: 'orange', // Cor da linha
      weight: 1 // Espessura da linha
    };

    const polygon = L.polyline(
      this.pathEquipmentData, pathStyle
    );

    // Adiciona ícone ao ponto de partida
    const startIcon = L.icon({
      iconUrl: 'assets/icon/teste.png',
      iconSize: [32, 32], // Tamanho do ícone
      //iconAnchor: [13, 41],
    });

    L.marker(this.pathEquipmentData[0], { icon: startIcon }).addTo(this.map);

    // Adiciona ícone ao ponto de chegada
    const endIcon = L.icon({
      iconUrl: 'assets/icon/teste.png',
      iconSize: [32, 32], // Tamanho do ícone
    });

    L.marker(this.pathEquipmentData[this.pathEquipmentData.length - 1], { icon: endIcon }).addTo(this.map);


    tiles.addTo(this.map);
    marker.addTo(this.map);
    circle.addTo(this.map);
    polygon.addTo(this.map);

    marker.bindPopup("<b>Hello world!</b><br>I am a popup.").openPopup();
    circle.bindPopup("I am a circle.");
    polygon.bindPopup("I am a polygon.");

    const popup = L.popup()
      .setLatLng(this.centroid)
      .setContent("I am a standalone popup.")
      .openOn(this.map);

    this.map.on('click', this.onMapClick);
  }

  onMapClick(e: any) {
    alert("You clicked the map at " + e.latlng);
  }

  ngOnDestroy() {
    if (this.map) {
      this.map.remove();
    }

  }

}
