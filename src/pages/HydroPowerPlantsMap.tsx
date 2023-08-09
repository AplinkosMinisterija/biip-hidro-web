import { useMediaQuery } from "@material-ui/core";
import "chartjs-adapter-moment";
import "moment/locale/lt";
//@ts-ignore
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { useState } from "react";
import {
  MapContainer,
  Marker,
  Popup,
  TileLayer,
  ZoomControl
} from "react-leaflet";
import styled from "styled-components";
import SelectField from "../components/fields/SelectField";
import MapLayout from "../components/Layouts/MapLayout";
import ButtonFilter from "../components/other/ButtonFilter";
import HydroPopUp from "../components/other/HydroPopUp";
import { device } from "../styles";
import { TimeRanges } from "../utils/constants";
import { handleGetViolationCount, timeRangeToQuery } from "../utils/functions";
import { useHydroPowerPlantsMap } from "../utils/hooks";
import { inputLabels } from "../utils/texts";
import { HydroPowerPlant, Range } from "../utils/types";

interface HydroPowerPlantsMapProps {
  center?: any[];
  zoom?: number;
}

const HydroPowerPlantsMap = ({
  center = [55.322, 23.897],
  zoom = 8
}: HydroPowerPlantsMapProps) => {
  const [timeFilter, setTimeFilter] = useState(TimeRanges.HOUR);
  const [dateFilter, setDateFilter] = useState<Range>(timeRangeToQuery.hour);
  const [location, setLocation] = useState<HydroPowerPlant>();
  const [map, setMap] = useState<any>();
  const isMobile = useMediaQuery(device.mobileL);

  const { hydroPowerPlants, current, setCurrent } =
    useHydroPowerPlantsMap(dateFilter);

  const greenMarker = L.icon({
    iconUrl: "/greenMarker.svg",
    iconSize: [30, 30]
  });

  const redMarker = L.icon({
    iconUrl: "/redMarker.svg",
    iconSize: [30, 30]
  });

  const blackMarker = L.icon({
    iconUrl: "/marker.svg",
    className: "blackMarker",
    iconSize: [30, 30]
  });

  const handleSetMarker = (item: HydroPowerPlant) => {
    item.geom.name = item?.name;

    if (!item.apiId) {
      return (item.geom.marker = blackMarker);
    }

    const violationCount = handleGetViolationCount(item);

    if (violationCount) {
      item.geom.marker = redMarker;
      item.geom.violationCount = violationCount;
      return;
    }
    item.geom.marker = greenMarker;
  };

  const handleSetLocation = (option: HydroPowerPlant) => {
    setLocation(option);

    if (option) {
      setCurrent(option);
      const markerCoordinates = [...option.geom.coordinates];
      map?.flyTo(markerCoordinates.reverse(), 15);
      return;
    }
    setCurrent(undefined);
  };

  return (
    <MapLayout>
      <Container>
        <MapBarContainer>
          <StyledSelectField
            placeholder={inputLabels.search}
            onChange={handleSetLocation}
            value={location}
            getOptionLabel={(option: HydroPowerPlant) =>
              `${option?.name}, ${option?.hydrostaticId}`
            }
            options={hydroPowerPlants}
          />
          <ButtonFilter
            timeFilter={timeFilter}
            dateFilter={dateFilter}
            onSetTimeFilter={setTimeFilter}
            onSetDateFilter={setDateFilter}
          />
        </MapBarContainer>

        {current && (
          <HydroPopUp
            customDate={dateFilter}
            timeFilter={timeFilter}
            current={current}
            onClose={() => setCurrent(undefined)}
          />
        )}

        <StyledMapContainer
          //@ts-ignore
          center={center}
          zoom={zoom}
          scrollWheelZoom={true}
          zoomControl={false}
          touchZoom={true}
          ref={setMap}
        >
          <TileLayer
            //@ts-ignore
            attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <ZoomControl position={isMobile ? "bottomleft" : "topright"} />

          {hydroPowerPlants?.map((item: HydroPowerPlant) => {
            handleSetMarker(item);
            const { geom } = item;

            return (
              <Marker
                position={[geom.coordinates[1], geom.coordinates[0]]}
                //@ts-ignore
                icon={geom.marker}
                eventHandlers={{
                  click: () => setCurrent(item),
                  mouseover: (e: any) => {
                    e.target.openPopup();
                  }
                }}
              >
                <Popup>
                  <PopupItem onClick={() => setCurrent(item)}>
                    {item.name}
                  </PopupItem>
                </Popup>
              </Marker>
            );
          })}
        </StyledMapContainer>
      </Container>
    </MapLayout>
  );
};

const PopupItem = styled.div`
  width: 100%;
  height: 100%;
  cursor: pointer;
`;

const StyledMapContainer = styled(MapContainer)`
  width: 100%;
  position: relative;
  display: flex;
  z-index: 1;
`;

const Container = styled.div`
  display: flex;
  height: 100%;
  position: relative;
`;

const StyledSelectField = styled(SelectField)`
  min-width: 400px;

  @media ${device.mobileL} {
    min-width: 100%;
  }
`;

const MapBarContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  position: absolute;
  z-index: 2;
  top: 20px;
  left: 50px;
  @media ${device.mobileL} {
    left: 0px;
    margin: 0 12px;
  }
`;

export default HydroPowerPlantsMap;
