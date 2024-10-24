import {Component} from 'react'
import Cookies from 'js-cookie'
import {BsSearch} from 'react-icons/bs'
import Loader from 'react-loader-spinner'

import Navbar from '../navbar'
import './index.css'
import JobItem from '../jobItem'

const employmentTypesList = [
  {
    label: 'Full Time',
    employmentTypeId: 'FULLTIME',
  },
  {
    label: 'Part Time',
    employmentTypeId: 'PARTTIME',
  },
  {
    label: 'Freelance',
    employmentTypeId: 'FREELANCE',
  },
  {
    label: 'Internship',
    employmentTypeId: 'INTERNSHIP',
  },
]

const salaryRangesList = [
  {
    salaryRangeId: '1000000',
    label: '10 LPA and above',
  },
  {
    salaryRangeId: '2000000',
    label: '20 LPA and above',
  },
  {
    salaryRangeId: '3000000',
    label: '30 LPA and above',
  },
  {
    salaryRangeId: '4000000',
    label: '40 LPA and above',
  },
]

class Jobs extends Component {
  state = {
    jobsList: [],
    searchText: '',
    employmentFilterList: [],
    salaryFilter: '',
    jobsFetchStatus: 'INITIAL',
    profileDetails: [],
    profileStatus: true,
    locationFilter: [],
  }

  componentDidMount() {
    this.getProfileDetails()
    this.getJobs()
  }

  getJobs = async () => {
    this.setState({
      jobsFetchStatus: 'IN_PROGRESS',
    })

    const jwtToken = Cookies.get('jwt_token')
    const options = {
      headers: {
        authorization: `Bearer ${jwtToken}`,
      },
      method: 'GET',
    }
    const {searchText, employmentFilterList, salaryFilter} = this.state
    // const employmentFilterString = employmentFilterList.join(',')
    const url = `https://apis.ccbp.in/jobs?employment_type=${employmentFilterList.join()}&search=${searchText}&minimum_package=${salaryFilter}`

    console.log(url)
    const response = await fetch(url, options)
    const jsonData = await response.json()

    if (response.ok) {
      const {jobs} = jsonData

      const updatedData = jobs.map(eachJob => ({
        id: eachJob.id,
        companyLogoUrl: eachJob.company_logo_url,
        employmentType: eachJob.employment_type,
        jobDescription: eachJob.job_description,
        location: eachJob.location,
        packagePerAnnum: eachJob.package_per_annum,
        rating: eachJob.rating,
        title: eachJob.title,
      }))

      if (jobs.length === 0) {
        this.setState({jobsList: [], jobsFetchStatus: 'NO JOBS FOUND'})
      } else {
        this.setState({
          jobsList: updatedData,
          jobsFetchStatus: 'SUCCESS',
        })
      }
    } else {
      this.setState({
        jobsFetchStatus: 'FAILURE',
      })
    }
  }

  onChangeSearchInput = event => {
    this.setState({searchText: event.target.value})
  }

  onSearchJobs = () => {
    this.getJobs()
  }

  renderLoader = () => (
    <div className="loader-container" data-testid="loader">
      <Loader type="ThreeDots" color="#ffffff" height="50" width="50" />
    </div>
  )

  renderProfileDetails = () => {
    const {profileDetails} = this.state
    const {name, profileImageUrl, shortBio} = profileDetails

    return (
      <div className="profileContainer">
        <img src={profileImageUrl} alt="profile" />
        <h1 className="profileName">{name}</h1>
        <p className="profileDescription">{shortBio}</p>
      </div>
    )
  }

  renderProfileFailureView = () => (
    <div className="profileFailure">
      <button
        onClick={this.getProfileDetails}
        className="retryButton"
        type="button"
      >
        Retry
      </button>
    </div>
  )

  renderMobileProfile = () => (
    <div className="profileContainer">
      <img
        src="https://assets.ccbp.in/frontend/react-js/male-avatar-img.png"
        alt="profile"
      />
      <h1 className="profileName">Rahul Attuluri</h1>
      <p className="profileDescription">
        Lead Software Developer and AI-ML expert
      </p>
    </div>
  )

  renderMobileFailureView = () => (
    <div className="profileFailure">
      <button
        onClick={this.getProfileDetails}
        className="retryButton"
        type="button"
      >
        Retry
      </button>
    </div>
  )

  onClickEmploymentFilter = event => {
    const {employmentFilterList} = this.state

    const employmentId = event.target.id
    const empTypeAlreadyThere = employmentFilterList.includes(employmentId)

    if (empTypeAlreadyThere) {
      this.setState(prevState => ({
        employmentFilterList: [
          ...prevState.employmentFilterList.filter(
            eachType => eachType !== employmentId,
          ),
        ],
      }))
    } else {
      this.setState(
        prevState => ({
          employmentFilterList: [
            ...prevState.employmentFilterList,
            employmentId,
          ],
        }),
        this.getJobs,
      )
    }
  }

  onClickSalary = event => {
    const {jobsList, filteredJobsList} = this.state

    const salaryId = event.target.id

    this.setState({salaryFilter: salaryId}, this.getJobs)
  }

  renderSuccessView = () => {
    const {jobsList, profileStatus, filteredJobsList} = this.state

    return (
      <>
        <div className="jobsMainContainer">
          <Navbar />
          <div className="jobsContainer">
            <div className="filtersContainer">
              {profileStatus
                ? this.renderProfileDetails()
                : this.renderProfileFailureView()}
              <hr />
              <h1 className="filterHeading">Type of Employment</h1>
              console.log(employmentTypesList)
              <ul>
                {employmentTypesList.map(eachItem => (
                  <li key={eachItem.label} className="filterItem">
                    <input
                      onClick={this.onClickEmploymentFilter}
                      id={eachItem.employmentTypeId}
                      type="checkbox"
                    />
                    <label
                      className="filterText"
                      htmlFor={eachItem.employmentTypeId}
                    >
                      {eachItem.label}
                    </label>
                  </li>
                ))}
              </ul>
              <hr />
              <h1 className="filterHeading">Salary Range</h1>
              <ul>
                {salaryRangesList.map(eachItem => (
                  <li key={eachItem.label} className="filterItem">
                    <input
                      onClick={this.onClickSalary}
                      type="radio"
                      name="salaryFilter"
                      id={eachItem.salaryRangeId}
                    />
                    <label htmlFor={eachItem.salaryRangeId}>
                      {eachItem.label}
                    </label>
                  </li>
                ))}
              </ul>
              <h1 className="filterHeading">Location</h1>
              <ul>
                <li className="filterItem">
                  <input
                    onClick={this.onClickLocationFilter}
                    type="checkbox"
                    id="Hyderabad"
                  />
                  <label htmlFor="Hyderabad">Hyderabad</label>
                </li>
                <li className="filterItem">
                  <input
                    onClick={this.onClickLocationFilter}
                    type="checkbox"
                    id="Bangalore"
                  />
                  <label htmlFor="Bangalore">Bangalore</label>
                </li>
                <li className="filterItem">
                  <input
                    onClick={this.onClickLocationFilter}
                    type="checkbox"
                    id="Chennai"
                  />
                  <label htmlFor="Chennai">Chennai</label>
                </li>
                <li className="filterItem">
                  <input
                    onClick={this.onClickLocationFilter}
                    type="checkbox"
                    id="Delhi"
                  />
                  <label htmlFor="Delhi">Delhi</label>
                </li>
                <li className="filterItem">
                  <input
                    onClick={this.onClickLocationFilter}
                    type="checkbox"
                    id="Mumbai"
                  />
                  <label htmlFor="Mumbai">Mumbai</label>
                </li>
              </ul>
            </div>
            <div className="jobs">
              <div className="searchJobsBar">
                <input
                  onChange={this.onChangeSearchInput}
                  placeholder="search"
                  className="searchJobs"
                  type="search"
                />
                <button
                  onClick={this.onSearchJobs}
                  data-testid="searchButton"
                  type="button"
                >
                  <BsSearch className="searchIcon" />
                </button>
              </div>
              <ul className="jobsItemsContainer">
                {jobsList.map(eachJob => (
                  <JobItem key={eachJob.id} jobDetails={eachJob} />
                ))}
              </ul>
            </div>
          </div>
        </div>
      </>
    )
  }

  renderFailureView = () => (
    <div className="jobsFailureContainer">
      <img
        src="https://assets.ccbp.in/frontend/react-js/failure-img.png"
        alt="failure view"
      />
      <h1 className="failureHeading">Oops! Something Went Wrong</h1>
      <p>We cannot seem to find the page you are looking for</p>
      <button onClick={this.getJobs} className="retryButton" type="button">
        Retry
      </button>
    </div>
  )

  getProfileDetails = async () => {
    const jwtToken = Cookies.get('jwt_token')

    const url = 'https://apis.ccbp.in/profile'
    const options = {
      headers: {
        authorization: `Bearer ${jwtToken}`,
      },
    }

    const response = await fetch(url, options)
    const jsonData = await response.json()

    if (response.ok) {
      const profileDetails = jsonData.profile_details
      const updatedData = {
        name: profileDetails.name,
        profileImageUrl: profileDetails.profile_image_url,
        shortBio: profileDetails.short_bio,
      }

      this.setState({
        profileStatus: true,
        profileDetails: updatedData,
      })
    } else {
      this.setState({
        profileStatus: false,
      })
    }
  }

  onClickLocationFilter = event => {
    const {jobsList} = this.state

    console.log(event.target.id)

    if (event.target.checked) {
      this.setState(prevState => ({
        jobsList: [
          ...prevState.jobsList.filter(
            eachJob =>
              eachJob.location.toLowerCase() === event.target.id.toLowerCase(),
          ),
        ],
      }))
    } else {
      this.setState(prevState => ({
        jobsList: [
          ...prevState.jobsList.filter(
            eachJob =>
              eachJob.location.toLowerCase() !== event.target.id.toLowerCase(),
          ),
        ],
      }))
    }
  }

  // displayFilteredJobs = () => {
  //   const {filteredJobsList} = this.state

  //   return filteredJobsList.map(eachJob => (
  //     <JobItem key={eachJob.id} jobDetails={eachJob} />
  //   ))
  // }

  // displayAllJobs = () => {
  //   const {jobsList} = this.state

  //   return
  // }

  renderNoJobsFound = () => (
    <div>
      <h1>No Jobs Found</h1>
      <img
        src="https://assets.ccbp.in/frontend/react-js/no-jobs-img.png"
        alt="no jobs"
      />
      <p>We could not find any jobs. Try other filters</p>
    </div>
  )

  render() {
    const {jobsFetchStatus} = this.state

    switch (jobsFetchStatus) {
      case 'IN_PROGRESS':
        return this.renderLoader()
      case 'SUCCESS':
        return this.renderSuccessView()
      case 'FAILURE':
        return this.renderFailureView()
      case 'NO JOBS FOUND':
        return this.renderNoJobsFound()
      default:
        return null
    }
  }
}

export default Jobs
