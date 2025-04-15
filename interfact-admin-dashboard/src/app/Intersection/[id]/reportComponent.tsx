import { Log } from "@/app/types/Firebase/LogMySql";
import { confirmReport } from "@/app/utils/intersection/confirmReport";
import { denyReport } from "@/app/utils/intersection/denyReport";
import { faThumbsUp, faThumbsDown } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

type ReportComponentProps = {
  report : string
  logItem : Log | undefined
  index : number
}

export function ReportComponent({report, logItem, index} : ReportComponentProps) {
    return (
        <div key={`${report}-${index}`} data-testid="report">
                  <div className='report-container'>
                    {logItem ? (
                      <div className='report-item-1'>
                        <div className="log-row"><span className="log-label">Log ID:</span> {logItem.logid}</div>
                        <div className="log-row"><span className="log-label">Camera ID:</span> {logItem.cameraid}</div>
                        <div className="log-row"><span className="log-label">Timestamp:</span> {new Date(logItem.timestamp).toLocaleString()}</div>
                        <div className="log-row"><span className="log-label">Filename:</span> {logItem.filename}</div>
                        <div className="log-row"><span className="log-label">Status:</span> {logItem.status}</div>
                        <div className="log-row"><span className="log-label">Path:</span> {logItem.path}</div>
                      </div>
                    ) : (
                      <p style={{ color: 'red' }}>No matching log found for logID: {report}</p>
                    )}
                    <div className='report-buttons-text'>Confirm or deny report:</div>
                    <div className="report-container2">
                      <div className='report-buttons'>
                        <button className='report-positive' onClick={() => logItem?.filename ? confirmReport(logItem.filename, logItem.path, logItem.logid, logItem.status) : console.warn("Filename is undefined")} data-testid="confirm">
                          <FontAwesomeIcon icon={faThumbsUp} />
                        </button>
                        <button className='report-negative' onClick={() => logItem?.logid ? denyReport(logItem.logid) : console.warn("Filename is undefined")} data-testid="deny">
                          <FontAwesomeIcon icon={faThumbsDown} />
                        </button>
                      </div>
                      <div className="report-img">
                        {/* logItem path is local to DB. Add directory from computer*/}
                        <img src={`${process.env.NEXT_PUBLIC_ROOT_IMAGE_DIR}${logItem?.path.replace("./", "/")}${logItem?.filename}`} alt="train" />
                      </div>
                    </div>
                  </div>
                </div>
    )
}

