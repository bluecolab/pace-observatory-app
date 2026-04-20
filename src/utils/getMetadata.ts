import locationOptions from './jsons/locationOptions.json';
import parameterInfo from './jsons/parameterInfo.json';
import stationIds from './jsons/stationIds.json';
import units from './jsons/units.json';
import usgsParameterMappings from './jsons/usgsParameterMapping.json';

export default function getMetadata() {
    return {
        parameterInfo,
        stationIds,
        usgsParameterMappings,
        locationOptions,
        units,
    };
}
