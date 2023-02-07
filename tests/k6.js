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

export const options = { // add ramp up to avoid excess missing reqs (see stages below)
  vus: 2000, // corresponds to RPS
  duration: '1m',
  thresholds: {
    http_req_duration: ["avg<2000"], // 95% of requests must complete below 2s, or ave
    http_req_failed: ["rate<0.01"], // http errors should be less than 1%
  },
};

export default function () {
  http.get('http://127.0.0.1:4206/qa/questions/?product_id=317867');
  sleep(1)
}