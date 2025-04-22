
type RequestComponentProps = {
    request : string
    index : number
  }

  export function RequestComponent({request, index} : RequestComponentProps) {
      return (
        <div key={`${request}-${index}`} data-testid="request">
                                <div className='request-container'>
                                    <div className='request-item shadow'>
                                    <div className='item-name'>{request}</div>
                                    </div>
                                </div>
                                </div>

          )
      }
      
      