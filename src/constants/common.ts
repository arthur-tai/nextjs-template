export const STATUS = {
  LOADING: "LOADING",
  INIT: "INIT",
  FETCHING: "FETCHING",
  FETCHED: "FETCHED",
  FETCH_ABORT: "FETCH_ABORT",
  FETCH_ERROR: "FETCH_ERROR",
}
export type STATUS_TYPE = keyof typeof STATUS

// directly check, store.status === STATUS.LOADING or implement this helper func
export const statusChecker = Object.freeze({
  isLoading: (s: STATUS_TYPE) => s === STATUS.LOADING,
  isInit: (s: STATUS_TYPE) => s === STATUS.INIT,
  isFetching: (s: STATUS_TYPE) => s === STATUS.FETCHING,
  isFetched: (s: STATUS_TYPE) => s === STATUS.FETCHED,
  isFetchAbort: (s: STATUS_TYPE) => s === STATUS.FETCH_ABORT,
  isFetchError: (s: STATUS_TYPE) => s === STATUS.FETCH_ERROR,
});