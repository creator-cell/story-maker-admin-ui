export default function AnalyticDashboard() {
    return (
        <>
            <div id="main_container">
                <div className="inner_container">
                    <div className="container p-0">
                        <div id="user" className="comman_admin_layout">
                            <div className="container p-0">
                                <div className="row">
                                    <div className="col-lg-12 col-md-12 col-sm-12">
                                        <div className="title_head">
                                            <h1>Analytic Dashboard</h1>
                                        </div>
                                    </div>
                                </div>
                                <div className="analytic-dashboard">
                                    <div className="row">
                                        <div className="col-lg-4 col-md-4 col-12">
                                            <div className="box">
                                                <div className="icon">
                                                    <img src="/images/active-user.png" alt="active-user" />
                                                </div>
                                                <div className="">
                                                    <p class="">Active Users</p>
                                                    <span class="">Total active users this month</span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="col-lg-4 col-md-4 col-12">
                                            <div className="box">
                                                <div className="icon">
                                                    <img src="/images/design-create.png" alt="active-user" />
                                                </div>
                                                <div className="">
                                                    <p class="">Designs Created</p>
                                                    <span class="">Total designs made by users</span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="col-lg-4 col-md-4 col-12">
                                            <div className="box">
                                                <div className="icon">
                                                    <img src="/images/use-template.png" alt="active-user" />
                                                </div>
                                                <div className="">
                                                    <p class="">Templates Used</p>
                                                    <span class="">Number of templates applied</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="analytic-dashboard">
                                    <div className="row">
                                        <div className="col-lg-6 col-md-6 col-12">
                                            <div className="box">

                                            </div>
                                        </div>
                                        <div className="col-lg-6 col-md-6 col-12">
                                            <div className="box">

                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="analytic-dashboard">
                                    <div className="row">
                                        <div className="col-lg-12 col-md-12 col-12">
                                            <div className="box">
                                                <img src="/images/template.png" alt="Template" />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}