export default function AddCamera() {
    return(
        <div>
            <div className="camera-add-main">
                <div className="camera-add-left shadow">
                    <h1>Add Camera</h1>
                    <hr />
                    <form className="camera-add-form" action="">
                        <label htmlFor="id">id</label>
                        <input id="id" type="text" />
                        <label htmlFor="name">name</label>
                        <input id="name" type="text" />
                        <label htmlFor="latitude">latitude</label>
                        <input id="latitude" type="text" />
                        <label htmlFor="logitude">longitude</label>
                        <input id="longtitude" type="text" />
                        <button className="camera-add-form-submit">ADD</button>
                    </form>
                </div>

                <div className="camera-add-right"></div>
            </div>
        </div>
    );
};