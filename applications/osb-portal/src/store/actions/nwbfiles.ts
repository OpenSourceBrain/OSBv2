import { CallOSBApiAction } from '../../middleware/osbbackend'

import { NWBFileActions } from '../reducers/nwbfiles'

export const loadNWBFilesActionType = NWBFileActions.loadNWBFiles.toString();
export const fetchNWBFilesActionType = 'nwbfiles/fetchNWBFiles';

export const fetchNWBFilesAction = (): CallOSBApiAction => {
  return ({
    type: fetchNWBFilesActionType,
    meta: {
      callOSBApi: true
    }
  })
}