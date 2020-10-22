import { CallOSBApiAction } from './workspaces'
import { ModelActions } from '../reducers/models'

export const loadModelsActionType = ModelActions.loadModels.toString();
export const fetchModelsActionType = 'models/fetchModels';

export const fetchModelsAction = (): CallOSBApiAction => {
  return ({
    type: fetchModelsActionType,
    meta: {
      callOSBApi: true
    }
  })
}