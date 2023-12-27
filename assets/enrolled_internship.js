var hostValue = window.location.hostname;
var portNumber = window.location.port;
if (user_email !== 'undefined') {
        let  internship_data;
        const new_user = decodeURIComponent(user_email.split('=')[1]);
        axios.get(`http://${hostValue}:${portNumber}/user_detail?email=${new_user}`)
        .then(function (response) {
            // Handle successful response
            internship_data = response.data
            outside_internship_data()
        })
        .catch(function (error) {
            // Handle error
            console.error('Error:', error);
        });

       function outside_internship_data(){
          if(internship_data.internships.length>0)
          {
             internship_data.internships.forEach(element => {
                 const internship_card = document.createElement('div')
                    internship_card.className = 'flex justify-center items-center bg-gray-200 h-fit w-fit p-5 shadow-lg rounded-lg my-5 mx-auto flex-col'
                     if(element.payment == false)
                     {
                         internship_card.innerHTML = `
                          <p>Enrolled for ${element.internship_domain_name}</p>
                          <p>Payment Status : Pending</p>
                         `
                     }
                     if(element.payment == true)
                        {
                            internship_card.innerHTML = `
                            <p>Enrolled for ${element.internship_domain_name}</p>
                            <p>Offer Letter</p>
                            <p>Tasks</p>
                            `
                        }
                     if(element.payment == true && element.certificate == true)
                     {
                            internship_card.innerHTML = `
                            <p>Enrolled for ${element.internship_domain_name}</p>
                            <p>Offer Letter</p>
                            <p>Tasks</p>
                            <p>Certificate</p>
                            `
                     }
                     
                    document.getElementById('internship_section').appendChild(internship_card)
             });
          }
          else
          {
             
          }
       }
}
