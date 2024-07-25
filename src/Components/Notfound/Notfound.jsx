import React from 'react'
import { Helmet } from 'react-helmet'
import { Link } from 'react-router-dom'
// import '../Notfound/Notfound.css'
import style from '../Notfound/Notfound.module.css'
export default function Notfound() {
  return (
    <>
    <Helmet>
        <meta charSet="utf-8" />
        <title>Error 404</title>
      </Helmet>
    <div className="py-5 my-5 text-center">
      <h1 className='text-4xl'>404</h1>
      <h2 className='text-4xl'>page not found</h2>
      <br />
      <Link to={"/"}>
      <button className={style.btn}>Go to Home Page</button>
        </Link>
    </div>
    </>
  )
}
{/* <div className={style.row + " " + style['leftside']}>

<div className={style['leftcontent'] + " col-md-6 flex items-center"}>
  <div className={style['formcontent'] + " mx-auto " + style['registerformcontent']}>

    <div className={style['headerwrapper']}>
      <div className={style['lightningbox']}>
        <h2 className={style['Registerheading'] + " pt-2"}>Register Here <i className="fas fa-arrow-down"></i></h2>
      </div>
    </div>
        <form onSubmit={handleSubmit}>

            <input onChange={handleChange} onBlur={handleBlur} value={values.firstName} placeholder='First Name' type="text" class='form-control mb-3' id='firstName' name='firstName' />
            {errors.firstName && touched.firstName && <p class="alert alert-danger">{errors.firstName}</p>}

            <input onChange={handleChange} onBlur={handleBlur} value={values.lastName} placeholder='Last Name' type="text" class='form-control mb-3' id='lastName' name='lastName' />
            {errors.lastName && touched.lastName && <p class="alert alert-danger">{errors.lastName}</p>}

            <input onChange={handleChange} onBlur={handleBlur} value={values.email} placeholder='Email' type="email" class='form-control mb-3' id='email' name='email' />
            {errors.email && touched.email && <p class="alert alert-danger">{errors.email}</p>}

            <input onChange={handleChange} onBlur={handleBlur} value={values.password} placeholder='Password' type="password" class='form-control mb-3' id='password' name='password' />
            {errors.password && touched.password && <p class="alert alert-danger">{errors.password}</p>}

            <input onChange={handleChange} onBlur={handleBlur} value={values.address} placeholder='Address' type="text" class='form-control mb-3' id='address' name='address' />
            {errors.address && touched.address && <p class="alert alert-danger">{errors.address}</p>}

            <input onChange={handleChange} onBlur={handleBlur} value={values.bDate} placeholder='Birth Date' type="date" class='form-control mb-3' id='bDate' name='bDate' />
            {errors.bDate && touched.bDate && <p class="alert alert-danger">{errors.bDate}</p>}

            <select onChange={handleChange} onBlur={handleBlur} value={values.userType} class='form-control mb-3 type-btn' id='userType' name='userType'>
                <option value="" disabled>Select Type</option>
                <option value="student">Student</option>
                <option value="instructor">Instructor</option>
            </select>
            {errors.userType && touched.userType && <p class="alert alert-danger">{errors.userType}</p>}
            {errormsg !=='' && <div class="alert alert-danger">{errormsg}</div>}

            {isLoading ?
                <button disabled type='button' class='btn bg-main px-4 text-white ms-auto block'> <i class='fas fa-spin fa-spinner px-3'></i> </button>
                :
                <button type='submit' disabled={!isValid || isLoading} class='btn login_btn px-3 text-white mx-auto block custom-bg-color'>Register</button>
            }
        </form>
    </div>
</div>

<div class="rightcontent">
    <h1 class='text-black'>
        Welcome
        <div class="herocontentwords"></div>
    </h1>
    <div class="imgcontent">
        <img src={img1} class="img-fluid mt-5" alt='' />
    </div>
</div>

</div>

</>
} */}