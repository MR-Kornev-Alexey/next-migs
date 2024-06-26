import handleApiResponse from "@/lib/common/handle-api-response";
import {updateSensors} from "@/store/sensorsReducer";
import handleApiError from "@/lib/common/handle-api-error";
import {sensorsClient} from "@/lib/sensors/sensors-client";
import updateSensorsAfterAPI from "@/lib/common/update-sensors-after-api";
import {useDispatch, useSelector} from "react-redux";
import {AppDispatch, RootState} from "@/store/store";

async function handleApiCall(apiCall, sensor_id, updateSensorsCallback, successCallback) {
  const allSensors = useSelector((state: RootState) => state.allSensors.value);
  const dispatch: AppDispatch = useDispatch();
  try {
    const result: any = await apiCall(sensor_id);
    const updatedSensors = await updateSensorsCallback(allSensors, result?.data?.oneSensor);
    handleApiResponse({
      result,
      successCallback: () => {
        dispatch(updateSensors(updatedSensors));
        if (successCallback) successCallback(result);
      },
      // setAlertColor,
      // setIsMessage,
      // setIsOpenModal
    });
  } catch (error) {
    // handleApiError(error, setIsMessage);
  }
}

async function updateSensorDesignation(sensor_id, value) {
  await handleApiCall(
    (id) => sensorsClient.changeDesignationOneSensorFromApi(id, value),
    sensor_id,
    updateSensorsAfterAPI
  );
}

async function handleChangeStatus(sensor_id) {
  await handleApiCall(
    sensorsClient.changeStatusOneSensorFromApi,
    sensor_id,
    updateSensorsAfterAPI
  );
}
