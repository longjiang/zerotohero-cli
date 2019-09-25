<template>
  <div class="container mt-5 mb-5">
    <div v-if="$l1.code === 'en' && $l2.code === 'zh'">
      <h1 class="mb-5">Course Release Schedule</h1>
      <p class="mb-3">We regularly update our courses. Here’s what we are planning on.</p>
      <div class="row">
        <div class="col-sm-12">
          <table class="table table-bordered">
            <thead>
              <tr class="table-secondary">
                <th>Course</th>
                <th>Release Date</th>
                <th>Progress</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td style="background-color: #f6b000;">HSK 1A</td>
                <td>June 2017</td>
                <td>
                  <i class="fa fa-check" />
                </td>
              </tr>
              <tr>
                <td style="background-color: #f6b000;">HSK 1B</td>
                <td>June 2017</td>
                <td>
                  <i class="fa fa-check" />
                </td>
              </tr>
              <tr>
                <td style="background-color: #2d7f97;">HSK 2A</td>
                <td>July 2017</td>
                <td>
                  <i class="fa fa-check" />
                </td>
              </tr>
              <tr>
                <td style="background-color: #2d7f97;">HSK 2B</td>
                <td>July 2017</td>
                <td>
                  <i class="fa fa-check" />
                </td>
              </tr>
              <tr>
                <td style="background-color: #ff771e;">HSK 3A</td>
                <td>Janurary 2017</td>
                <td>
                  <i class="fa fa-check" />
                </td>
              </tr>
              <tr>
                <td style="background-color: #ff771e;">HSK 3B</td>
                <td>Janurary 2017</td>
                <td>
                  <i class="fa fa-check" />
                </td>
              </tr>
              <tr>
                <td style="background-color: #bb1b17;">HSK 4A</td>
                <td>Feburary 4, 2018</td>
                <td>
                  <i class="fa fa-check" />
                </td>
              </tr>
              <tr>
                <td style="background-color: #bb1b17;">HSK 4B</td>
                <td>Feburary 23, 2018</td>
                <td>
                  <i class="fa fa-check" />
                </td>
              </tr>
              <tr>
                <td style="background-color: #bb1b17;">HSK 4C</td>
                <td>Mar 8, 2018</td>
                <td>
                  <i class="fa fa-check" />
                </td>
              </tr>
              <tr>
                <td style="background-color: #bb1b17;">HSK 4D</td>
                <td>Apr 5, 2018</td>
                <td>
                  <i class="fa fa-check" />
                </td>
              </tr>
              <tr>
                <td style="background-color: #1a386d;">HSK 5A</td>
                <td>May 3, 2018</td>
                <td>
                  <i class="fa fa-check" />
                </td>
              </tr>
              <tr>
                <td style="background-color: #1a386d;">HSK 5B</td>
                <td>May 20, 2018</td>
                <td>
                  <i class="fa fa-check" />
                </td>
              </tr>
              <tr>
                <td style="background-color: #1a386d;">HSK 5C</td>
                <td>Jul 1, 2018</td>
                <td>
                  <i class="fa fa-check" />
                </td>
              </tr>
              <tr>
                <td style="background-color: #1a386d;">HSK 5D</td>
                <td>Jul 10, 2018</td>
                <td>
                  <i class="fa fa-check" />
                </td>
              </tr>
              <tr>
                <td style="background-color: #6a3368;">HSK 6A</td>
                <td>Sep 23, 2018</td>
                <td>
                  <i class="fa fa-check" />
                </td>
              </tr>
              <tr>
                <td style="background-color: #6a3368;">HSK 6B</td>
                <td>Oct 14, 2018</td>
                <td>
                  <i class="fa fa-check" />
                </td>
              </tr>
              <tr>
                <td style="background-color: #6a3368;">HSK 6C</td>
                <td>Dec 1, 2018</td>
                <td>
                  <i class="fa fa-check" />
                </td>
              </tr>
              <tr>
                <td style="background-color: #6a3368;">HSK 6D</td>
                <td>Dec 12, 2018</td>
                <td>
                  <i class="fa fa-check" />
                </td>
              </tr>
              <tr>
                <td style="background-color: #d53232;">Mandarin Pronunciation</td>
                <td>Mar 11, 2019</td>
                <td>
                  <i class="fa fa-check" />
                </td>
              </tr>
              <tr>
                <td style="background-color: #3a5eab;">Path To Fluency</td>
                <td>May 19, 2019</td>
                <td>
                  <i class="fa fa-check" />
                </td>
              </tr>
              <tr>
                <td style="background-color: #1a386d;">HSK 5 Upgrade*</td>
                <td>Late 2019</td>
                <td></td>
              </tr>
              <tr>
                <td style="background-color: #6a3368;">HSK 6 Upgrade*</td>
                <td>Late 2019</td>
                <td></td>
              </tr>
            </tbody>
          </table>
          <p>
            * We are planning to upgrade and improve HSK 5 and 6 this year. All
            students will get the updates as they become available. At Zero to
            Hero, you will always get the latest and greatest content without
            paying anything additional.
          </p>
          <p>Updated Aug 2019</p>
        </div>
      </div>
    </div>
    <div v-if="$l1.code === 'zh' && $l2.code === 'en'">
      <h1 class="mb-5">课程发布时间表</h1>
      <p class="mb-3">我们在不断更新课程。以下是我们未来的计划。</p>
      <div class="row">
        <table class="table">
          <thead>
            <tr>
              <th>课程封面</th>
              <th>课程名称</th>
              <th>购买链接</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>
                <a href="https://wazuc.duanshu.com/#/course/02eaa75857d749048504c0f9a3d89a87">
                  <img src="https://www.filepicker.io/api/file/LsVQWf7SQ6dnSrI7Gq91" alt="美式英语发音课程" />
                </a>
                <br />
              </td>
              <td>美式英语发音课程</td>
              <td>
                <a href="https://wazuc.duanshu.com/#/course/02eaa75857d749048504c0f9a3d89a87">查看详情</a>
              </td>
            </tr>
            <tr>
              <td>
                <a href="https://wazuc.duanshu.com/#/brief/course/82ada0a7cd424e568c14d399207df96d">
                  <img src="https://www.filepicker.io/api/file/F3WTIyfFSbe2ZWZEgb05" alt="C2词汇" />
                </a>
              </td>
              <td>欧标C2词汇</td>
              <td>
                <a
                  href="https://wazuc.duanshu.com/#/brief/course/82ada0a7cd424e568c14d399207df96d"
                >查看详情</a>
              </td>
            </tr>
            <tr>
              <td>
                <img src="https://www.filepicker.io/api/file/cmg48f1qTBSIEbQ9LFlo" />
              </td>
              <td>
                <strong>英语英雄7级（欧标C2）</strong>
                <br />让欧标C2程度的英语流利使用者继续进步。
                <br />
              </td>
              <td>课程策划中</td>
            </tr>
            <tr>
              <td>
                <a href="https://wazuc.duanshu.com/#/course/af26c83d32c843afa13cb915cbf1ab43">
                  <img
                    src="https://www.filepicker.io/api/file/4u2DBV8TpO1ZIVuIFuRQ"
                    alt="英语英雄6级（欧标C1）"
                  />
                </a>
              </td>
              <td>
                <strong>英语英雄6级（欧标C1）</strong>
                <br />达到雅思8分，适合英语专业学生。
              </td>
              <td>
                <a href="https://wazuc.duanshu.com/#/course/af26c83d32c843afa13cb915cbf1ab43">查看详情</a>
                <br />
              </td>
            </tr>
            <tr>
              <td>
                <a href="https://wazuc.duanshu.com/#/course/cb3011a438c14b979eda82c8de1ed6f0">
                  <img
                    src="https://www.filepicker.io/api/file/9zFnb5hnSmy0mVQEEr5i"
                    alt="英语英雄5级（欧标B2）"
                  />
                </a>
              </td>
              <td>
                <strong>英语英雄5级（欧标B2）</strong>
                <br />达到雅思6.5分，适合高中生和大学生。
                <br />
              </td>
              <td>
                <a href="https://wazuc.duanshu.com/#/course/cb3011a438c14b979eda82c8de1ed6f0">查看详情</a>
                <br />
              </td>
            </tr>
            <tr>
              <td>
                <img src="https://www.filepicker.io/api/file/80g42inKToSUdpsrwiQz" />
              </td>
              <td>
                <strong>英语英雄4级（欧标B1）</strong>
                <br />达到雅思5分，适合初中生。
                <br />
              </td>
              <td>课程策划中</td>
            </tr>
            <tr>
              <td>
                <img src="https://www.filepicker.io/api/file/kkOOwZpBTTCBx9vSjT7P" />
              </td>
              <td>
                <strong>英语英雄3级（欧标A2）</strong>
                <br />适合英语初学者和4-6年级小学生。
              </td>
              <td>
                课程策划中
                <br />
              </td>
            </tr>
            <tr>
              <td>
                <img src="https://www.filepicker.io/api/file/225unJUHS2eEbYcEaRAP" />
              </td>
              <td>
                <strong>英语英雄2级（欧标A1）</strong>
                <br />适合英语初学者和1-3年级小学生。
                <br />
              </td>
              <td>课程策划中</td>
            </tr>
            <tr>
              <td>
                <img src="https://www.filepicker.io/api/file/Em3Dm8P0QxW2bW1y0CnW" />
              </td>
              <td>
                <strong>英语英雄1级（欧标Pre-A1）</strong>
                <br />适合从来没有学过英语的人。
                <br />
              </td>
              <td>
                课程策划中
                <br />
                <br />
              </td>
            </tr>
            <tr>
              <td>
                <img
                  src="https://www.filepicker.io/api/file/1llHxonMRdCnKIqbqjKP"
                  class="img-responsive"
                />
              </td>
              <td>流利之路</td>
              <td>
                课程策划中
                <br />
              </td>
            </tr>
            <tr>
              <td>
                <img
                  src="https://www.filepicker.io/api/file/dgFi66suRwe0RHS2BFsV"
                  class="img-responsive"
                />
              </td>
              <td>英中翻译课程</td>
              <td>
                课程策划中
                <br />
              </td>
            </tr>
          </tbody>
        </table>

        <p>2019年9月更新</p>
      </div>
    </div>
  </div>
</template>

<script>
export default {}
</script>

<style scoped>
td:first-child {
  color: white;
}
</style>
