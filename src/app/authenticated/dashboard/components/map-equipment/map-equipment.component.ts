import { Component, OnDestroy, OnInit } from '@angular/core';
import { map } from 'rxjs/operators';

import L from 'leaflet';

import { environment as env } from '../../../../../environments/environment';
import { EquipmentsState } from '../../../../services/states/equipments.state';

@Component({
  selector: 'app-map-equipment',
  standalone: true,
  imports: [],
  templateUrl: './map-equipment.component.html',
  styleUrl: './map-equipment.component.scss'
})
export class MapEquipmentComponent implements OnInit, OnDestroy {

  private map!: L.Map;

  public pathEquipmentData!: any;

  constructor(private state: EquipmentsState) { }

  ngOnInit(): void {

    this.state.equipmentPosition$.pipe(map((item) => item.positions)).subscribe((result) => {

      this.pathEquipmentData = result;

      if (this.map) this.map.remove();

      this.initMap();

    });

  }

  initMap() {

    this.map = L.map('map').setView(this.pathEquipmentData[0], 10);

    const tiles = L.tileLayer(env.MAP_LAYER, {
      maxZoom: 18,
      minZoom: 10,
      attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    });

    const pathStyle = {
      color: 'red',
      weight: 2,
      smoothFactor: 0.5
    };

    const circle = L.circle(this.pathEquipmentData[0], {
      color: '#2FB366',
      fillColor: '#3EED4A',
      fillOpacity: 0.5,
      weight: 1,
      radius: 10500
    });

    const polygon = L.polyline(
      this.pathEquipmentData, pathStyle
    );

    const startIcon = L.icon({
      iconUrl: 'assets/icon/tractor.png',
      iconSize: [32, 32],
    });
    L.marker(this.pathEquipmentData[0], { icon: startIcon }).addTo(this.map);

    const endIcon = L.icon({
      iconUrl: 'assets/icon/tractor.png',
      iconSize: [32, 32],
    });
    L.marker(this.pathEquipmentData[this.pathEquipmentData.length - 1], { icon: endIcon }).addTo(this.map);


    tiles.addTo(this.map);

    circle.addTo(this.map);
    polygon.addTo(this.map);

    circle.bindPopup("Zona de trabalho.");
    polygon.bindPopup("Caminho percorrido.");

    // const lastItemIndex = this.pathEquipmentData.length - 1;
    // const lastItem = this.pathEquipmentData[lastItemIndex];
    // const popup = L.popup()
    //   .setLatLng(lastItem)
    //   .setContent("Inicio")
    //   .openOn(this.map);

    this.map.on('click', this.onMapClick);
  }

  onMapClick(e: any) {
    alert("Coordenandas: " + e.latlng);
  }

  ngOnDestroy() {
    if (this.map) {
      this.map.remove();
    }

  }

}
