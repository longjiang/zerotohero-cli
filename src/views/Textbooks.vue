<template>
  <div class="container mt-5 mb-5">
    <div v-if="$l1.code === 'en' && $l2.code === 'zh'">
      <div class="row">
        <div class="col-sm-12">
          <h1 class="mb-5">Textbooks and Workbooks</h1>
        </div>
      </div>
      <div class="row">
        <div class="col-sm-12">
          <h3>HSK Standard Course (Author: Jiang Liping)</h3>
          <Annotate tag="p">
            <strong>《HSK 标准教程》 （作者：姜丽萍）</strong>
          </Annotate>
          <img
            src="/img/textbooks-hsk.png"
            class="img-fluid w-50"
            alt="HSK Standard Course Textbooks"
            style="float: right"
          />
          <Annotate>
            <p>
              Authorized by&nbsp;
              <a href="http://english.hanban.org/">Hanban</a> ( 汉办), HSK
              Standard Course is developed under the joint efforts of
              北京语言大学出版社 (Beijing Language and Culture University Press,
              or BLCUP) and 汉考国际教育科技（北京）有限公司 (Chinese Testing
              International, or CTI). With HSK test papers as its primary source,
              HSK Standard Course is characterized by a humorous style, familiar
              topics and a scientific course design. Matching the HSK test in all
              aspects, from the content, form to the levels, it is a series of
              new-type course books embodying the idea of &ldquo;combining testing
              and teaching, and promoting learning and teaching by testing&rdquo;.
              It is suitable for the Confucius Institutes in different countries
              as well as other Chinese teaching institutions and self-taught
              learners.
            </p>
          </Annotate>
          <p>
            The whole series is divided into six levels matching the HSK test,
            with one volume for each of Levels 1-3 and two volumes for each of
            Levels 4-6, totaling nine volumes.
          </p>
        </div>
      </div>
      <div class="row">
        <div class="col-sm-12">
          <div class="bg-warning text-dark text-center p-3 rounded mt-5">
            <h5>A Friendly Reminder</h5>To take our online courses, you need
            <em>separately</em> purchase the
            textbooks and corresponding workbooks for each level.
          </div>
        </div>
      </div>
      <div class="row mt-5">
        <div class="col-12 col-md-4">
          <img class="w-100" src="/img/workbooks-1.png" alt="HSK textbooks 1 through 6">
        </div>
        <div class="col-12 col-md-7 offset-0 offset-md-1">
          <Annotate tag="div" class="col-12 mb-4">
            <h3>In China?</h3>
            <p>
              There are many physical bookstores in China that sell these textbooks
              and workbooks, but it may be more convenient to just order them online
              and have them delivered to your door. Here are some options to
              purchase online.
            </p>
            <!-- .et_pb_text -->
            <div>
              <a
                data-bg-level="3"
                class="btn mb-3"
                href="https://search.jd.com/Search?keyword=hsk%E6%A0%87%E5%87%86%E6%95%99%E7%A8%8B&amp;enc=utf-8&amp;wq=hsk%E6%A0%87%E5%87%86%E6%95%99%E7%A8%8B&amp;pvid=878ba2b798bb45e581cedb1334e7147e"
              >JINGDONG 京东</a>
            </div>
            <div>
              <a
                data-bg-level="3"
                class="btn mb-3"
                href="https://s.taobao.com/search?q=hsk标准教程&amp;imgfile=&amp;js=1&amp;stats_click=search_radio_all%3A1&amp;initiative_id=staobaoz_20180316&amp;ie=utf8"
              >Taobao 淘宝</a>
            </div>
            <div>
              <a
                data-bg-level="3"
                class="btn mb-3"
                href="http://search.dangdang.com/?key=HSK%B1%EA%D7%BC%BD%CC%B3%CC&amp;act=input"
              >DANGDANG 当当</a>
            </div>
          </Annotate>
          <Annotate tag="div" class="col-12 mb-4">
            <h3>Outside of China?</h3>
            <p>
              The best option would be purchasing them
              online.&nbsp;PurpleCulture.net is a Hong Kong based online business
              dedicated in providing Chinese cultural and educational products. They
              stock all of the HSK Standard Course textbooks and workbooks, and
              provide worldwide shipping. Alternatively, you may also purchase them
              from Amazon.com.&nbsp;
            </p>
            <!-- .et_pb_text -->
            <div>
              <a
                data-bg-level="3"
                class="btn mb-3"
                href="https://www.purpleculture.net/hsk-standard-course-bs-719/">Purple Culture
              </a>
            </div>
            <div>
              <a
                data-bg-level="3"
                class="btn"
                href="http://amzn.to/2pgZu4l">Amazon
              </a>
            </div>
          </Annotate>
          <Annotate tag="div" class="col-12">
            <h3>eBooks available?</h3>
            <p>
              As of early 2020, the official textbook publisher <a href="https://www.blcup.com">(BLCUP)</a> finally released the textbooks/workbooks in eBook format (flipviewer only for Windows PC as of now).

              We still recommend buying physical copies of the book as many of our students also prefer learning with the paper-versions. But if buying the book is an issue for you, as an alternatively -  you can purchase the ebook version. Click on the "eBook: view" above the "Buy" button.
            </p>
            <!-- .et_pb_text -->
            <div>
              <a
                data-bg-level="3"
                class="btn mb-3"
                href="https://www.purpleculture.net/hsk-standard-course-bs-719/">Purple Culture
              </a>
            </div>
            <div>
              <a
                data-bg-level="3"
                class="btn"
                href="http://amzn.to/2pgZu4l">Amazon
              </a>
            </div>
          </Annotate>
        </div>
      </div>
    </div>
    <div v-if="$l1.code === 'zh' && $l2.code === 'en'">
      <div class="row">
        <div class="col-sm-12">
          <h1 class="mb-5">{{ $t('Course Textbooks') }}</h1>
        </div>
      </div>
      <div class="row">
        <div class="col-sm-12">
          <p>使用“英语英雄1-6级”课程时需要配套课本。您需要购买的课本是《剑桥标准英语教程（第二版）》的学生用书：</p>
          <ul>
            <li>
              英语英雄1级：
              <a
                title=" 剑桥标准英语教程1A+1B学生用书 【新东方专营店】"
                href="http://product.dangdang.com/1485035296.html"
                ddclick="act=normalResult_title&amp;pos=1485035296_0_1_q"
                name="itemlist-title"
                dd_name="单品标题"
                target="_blank"
              >剑桥标准英语教程1A+1B学生用书</a>
            </li>
            <li>
              英语英雄2级：
              <a
                title=" 剑桥标准英语教程2A+2B 学生用书 【新东方专营店】"
                href="http://product.dangdang.com/1485035196.html"
                ddclick="act=normalResult_title&amp;pos=1485035196_8_0_q"
                name="itemlist-title"
                dd_name="单品标题"
                target="_blank"
              >剑桥标准英语教程2A+2B 学生用书</a>
            </li>
            <li>
              英语英雄3级：
              <a
                title=" [包邮套装]剑桥标准英语教程3A+3B：学生用书第2版 E英语教程【新东方专营店】"
                href="http://product.dangdang.com/1473293496.html"
                ddclick="act=normalResult_title&amp;pos=1473293496_7_0_q"
                name="itemlist-title"
                dd_name="单品标题"
                target="_blank"
              >剑桥标准英语教程3A+3B：学生用书</a>
              <span class="redactor-invisible-space"></span>
            </li>
            <li>
              <span class="redactor-invisible-space">
                英语英雄4级：
                <a
                  title=" 剑桥标准英语教程4A+4B 学生用书 第2版【新东方专营店】"
                  href="http://product.dangdang.com/1484902296.html"
                  ddclick="act=normalResult_title&amp;pos=1484902296_4_1_q"
                  name="itemlist-title"
                  dd_name="单品标题"
                  target="_blank"
                >剑桥标准英语教程4A+4B 学生用书</a>
              </span>
            </li>
            <li>
              英语英雄5级：
              <a
                title=" 剑桥标准英语教程5A+5B学生用书 第2版【新东方专营店】"
                href="http://product.dangdang.com/1485034896.html"
                ddclick="act=normalResult_title&amp;pos=1485034896_6_1_q"
                name="itemlist-title"
                dd_name="单品标题"
                target="_blank"
              >剑桥标准英语教程5A+5B学生用书</a>
              <span class="redactor-invisible-space"></span>
            </li>
            <li>
              英语英雄6级：
              <a
                title=" 剑桥标准英语教程6A+6B:学生用书(附光盘) 第2版 共2册"
                href="http://product.dangdang.com/1486720175.html"
                ddclick="act=normalResult_title&amp;pos=1486720175_0_1_q"
                name="itemlist-title"
                dd_name="单品标题"
                target="_blank"
              >剑桥标准英语教程6A+6B:学生用书</a>
              <span class="redactor-invisible-space"></span>
            </li>
          </ul>
          <p>以上链接只是参考。您可以根据自己的喜好去任意书店购买。更多课本详情请见每个课程的说明，以及课程介绍单元的“如何购买课本”项。</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {}
</script>

<style></style>
