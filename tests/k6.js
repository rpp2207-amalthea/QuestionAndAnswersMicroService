import http from 'k6/http';
import {sleep} from 'k6';
// export const options = {
//   insecureSkipTLSVerify: true,
//   noConnectionReuse: false,
//   vus: 120,
//   duration: '1m'
// };
// export default function () {
//   http.get('http://127.0.0.1:4206/qa/questions/?product_id=316798');
//   sleep(1)
// }
const requests = () => {
  let httpRequests = [];
  for (let i = 900010 ; i < 1000008; i ++ ) {
    const req = {
      method:'GET',
      url:`http://127.0.0.1:4206/qa/questions/?product_id=${i}`
    }
    httpRequests.push(req)
}
return httpRequests
}



export const options = { // add ramp up to avoid excess missing reqs (see stages below)
  vus: 100, // corresponds to RPS
  duration: '1m',
  thresholds: {
    http_req_duration: ["avg<2000"], // 95% of requests must complete below 2s, or ave
    http_req_failed: ["rate<0.01"], // http errors should be less than 1%
  },
};

export default function () {
  let httpRequests = [];
  for (let i = 900010 ; i < 1000008; i ++ ) {
    const req = {
      method:'GET',
      url:`http://127.0.0.1:4206/qa/questions/?product_id=${i}`
    }
    httpRequests.push(req)
}
  http.batch(httpRequests)
  sleep(1)
}