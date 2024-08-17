import React, { useState, useEffect, useRef } from 'react';
import { Button, Result, Card, Input, Checkbox, Form, message, Typography } from 'antd';
import { useSelector } from 'react-redux';
import { db } from 'configs/firebaseAuth';
import { doc, getDoc, updateDoc } from 'firebase/firestore';

const TermsAndConditions = () => {
  const [isScrolledToEnd, setIsScrolledToEnd] = useState(false);
  const [agreementStatus, setAgreementStatus] = useState(null);
  const [form] = Form.useForm();
  const termsRef = useRef(null);
  const userUID = useSelector((state) => state.auth.userUID);
  const [userData, setUserData] = useState(null);

  const agmtDateTime = new Date();
  const checkboxStatement = "I hereby declare that I have thoroughly read and understood the agreement above and agree to be bound by all its provisions.";
  const { Text, Paragraph, Title } = Typography;

  useEffect(() => {
    const fetchAgreementStatus = async () => {
      if (!userUID) return;

      const userDocRef = doc(db, 'users', userUID);
      const userDoc = await getDoc(userDocRef);

      if (userDoc.exists()) {
        const data = userDoc.data();
        setUserData(data);
        if (data.agreement === 'agreed') {
          setAgreementStatus('agreed');
        } else {
          setAgreementStatus('not_agreed');
        }
      }
    };

    fetchAgreementStatus();
  }, [userUID]);

  const handleScroll = () => {
    const { scrollTop, scrollHeight, clientHeight } = termsRef.current;
    console.log('ScrollTop:', scrollTop);
    console.log('ScrollHeight:', scrollHeight);
    console.log('ClientHeight:', clientHeight);
    if (scrollTop + clientHeight >= scrollHeight - 10) {
      console.log('Reached end of scroll');
      setIsScrolledToEnd(true);
    }
  };

  const onFinish = async (values) => {
    if (values.fullName !== userData.name) {
      message.error('Full name does not match with our records.');
      return;
    }

    const agreementText = document.getElementById('terms-content').innerText;

    const userDocRef = doc(db, 'users', userUID);
    await updateDoc(userDocRef, {
      agreement: 'agreed',
      agreementDetails: {
        agreementDateTime: agmtDateTime.toISOString(),
        readWholeTerms: true,
        agreeCheckbox: values.checkboxStatement ? checkboxStatement : '',
        signature: values.fullName,
        agreementText: agreementText,
      },
    });

    message.success('Agreement accepted successfully!');
    setAgreementStatus('agreed');
  };

  if (agreementStatus === 'agreed') {
    return (
      <div style={{ padding: '24px', maxWidth: '700px', margin: '0 auto' }}>
        <Result
    status="success"
    title="Successfully agreed to the terms!"
    subTitle="You have already agreed to the Exclusive Licensing And Distribution Agreement."
    extra={[
      <Button type="primary" href="/home">Continue to Home</Button>
    ]}
  />
      </div>
    );
  }

  return (
    <div style={{ padding: '24px', maxWidth: '1000px', margin: '0 auto' }}>
      <Card title={<div style={{ textAlign: 'center' }}>Exclusive Licensing And Distribution Agreement</div>} bordered={false}>
        <div
          ref={termsRef}
          onScroll={handleScroll}
          style={{ height: '350px', overflowY: 'scroll', border: '1px solid #f0f0f0', padding: '16px' }}
          id="terms-content"
        >
          {userData ? (
            <div>
            <Paragraph>
              This agreement (the "Agreement") is made as of {agmtDateTime.toISOString()} (the "Effective Date")
              By and between: <Text strong>{userData.name}</Text> (hereinafter referred to as the "Licensor") and <Text strong>VinylVista Private Limited
              t/a "SoundXpand"</Text> (hereinafter referred to as the "Licensee").
            </Paragraph>
            <br />
            <Paragraph>
              Capitalized terms not explicitly defined within the basic terms and conditions outlined below ("Basic Terms") shall be construed according
              to the definitions provided in the general terms and conditions appended hereto as Schedule A ("General Terms and Conditions").
            </Paragraph>
            <br />
            <Paragraph strong>
              By electing to participate in this Agreement and/or utilizing the licensing or distribution services provided by Licensee, Licensor
              acknowledges and agrees to adhere to the terms delineated herein. Should Licensor decline to accept this Agreement in its entirety,
              refrain from consenting and/or signing this Agreement, and abstain from availing Licensor's of the licensing or distribution services
              offered by Licensee. The commencement of this Agreement, henceforth referred to as the "Effective Date," shall be construed as the date
              upon which Licensor initially elects to participate in or utilize the licensing or distribution services provided by Licensee.
            </Paragraph>
            <br />
            <Title level={2} style={{ textAlign: 'center' }}>Basic Terms</Title>
            <br />
            <ol>
              <li>
                <Paragraph>
                  <Text strong underline>Grant Of Rights</Text>: The Licensor hereby grants to the Licensee the following exclusive rights also in
                  accordance with the General Terms and Conditions, supplementing the rights granted therein:
                  <br />
                  <ol style={{ listStyleType: 'lower-alpha', paddingTop: '10px' }}>
                    <li>
                      <Text>exclusive Digital Distribution rights for the Recordings;</Text>
                    </li>
                    <li>
                      <Text>exclusive Neighboring Rights Administration, if opted;</Text>
                    </li>
                    <li>
                      <Text>exclusive Content ID Rights;</Text>
                    </li>
                    <li>
                      <Text>exclusive YouTube Channel Admin Services, if opted;</Text>
                    </li>
                    <li>
                      <Text>non-exclusive Procured Licensing Rights;</Text>
                    </li>
                  </ol>
                </Paragraph>
              </li>
              <li>
                <Paragraph>
                  <Text strong underline>Royalty</Text>: In complete consideration of the rights conferred upon Licensee herein, and contingent
                  upon Licensor's complete and diligent fulfillment of all stipulated terms and conditions herein, Licensor shall receive payment
                  as follows:
                  <br />
                  <ol style={{ listStyleType: 'lower-alpha', paddingTop: '10px' }}>
                    <li>
                      <Text>85% of Net Receipts from Digital Distribution and Neighboring Rights Administration of the Recordings;</Text>
                    </li>
                    <li>
                      <Text>85% of Net Receipts from Content ID,YouTube, and YouTube Channel Admin Services from the exploitation of the Videos;</Text>
                    </li>
                    <li>
                      <Text>50% of Net Receipts from Procured Licensing from the exploitation of the Videos;</Text>
                    </li>
                    <li>
                      <Text>50% of Net Receipts from Sources of revenue beyond those delineated in subsections (a), (b) and (c) above.</Text>
                    </li>
                  </ol>
                </Paragraph>
              </li>
              <li>
                <Paragraph>
                  <Text strong underline>Term</Text>: The duration of this Agreement shall commence on the Effective Date and remain in force until the
                  conclusion of all Licensing Terms. Each Licensed Content shall possess an initial Licensing Terms of one (3) year, starting from
                  Licensee's initial commercial release of the respective Licensed Content. Similarly, if applicable, the initial term for YouTube
                  Channel Admin Services shall be one (3) year, commencing upon the Channel's acceptance into The SoundXpand Network. Upon expiration
                  of the initial term of each Licensing Terms, automatic renewal will occur, extending the term for successive one (3) year periods,
                  subject to termination as per the provisions outlined in the Schedule A (General Terms and Conditions).
                </Paragraph>
              </li>
              <li>
                <Paragraph>
                  <Text strong underline>Territory</Text>: Worldwide.
                </Paragraph>
              </li>
            </ol>
            <br />
            <Title level={1} style={{ textAlign: 'center' }}>Schedule A</Title>
            <Title level={2} style={{ textAlign: 'center' }}>General Terms And Conditions</Title>
            <br />
            <ol>
              <li>
                <Paragraph>
                  <Text strong underline>Definitions and Interpretation</Text>: In this Agreement, unless the context otherwise requires, the following
                  terms shall have the meanings ascribed to them below:
                  <br />
                  <ol style={{ listStyleType: 'lower-alpha', paddingTop: '10px' }}>
                    <li>
                      <Text>“<Text strong>Assets</Text>": means in respect of each audio or video file, metadata, artwork, and any other materials
                      reasonably necessary for Licensee to exercise the Rights outlined herein for each Recordings or Videos outlined herein.</Text>
                    </li>
                    <li>
                      <Text>“<Text strong>Recordings</Text>”: means any audio recording for which Licensor hold exploitation rights within the Licensed Territory at
                        any point during the Licensing Terms, limited to the extent of those rights.</Text>
                    </li>
                    <li>
                      <Text>“<Text strong>Videos</Text>”: means any promotional music video or long-form video for which Licensor hold exploitation rights within the
                        Licensed Territory at any point during the Licensing Terms, limited to the extent of those rights.</Text>
                    </li>
                    <li>
                      <Text>"<Text strong>Digital Distribution</Text>": Shall mean the distribution of Assets via Digital Services including but not limited to streaming
                        services, download platforms, and social media platforms.</Text>
                    </li>
                    <li>
                      <Text>"<Text strong>Neighboring Rights</Text>": Shall mean the rights related to the public performance, broadcasting, and communication to the public
                        of sound recordings.</Text>
                    </li>
                    <li>
                      <Text>"<Text strong>Content ID</Text>": Shall mean the digital fingerprinting technology used to identify and manage copyrighted content on digital
                        platforms.</Text>
                    </li>
                    <li>
                      <Text>"<Text strong>YouTube Channel Admin Services</Text>": Shall mean the management and optimization of Licensor's YouTube channel, if opted into
                        by the Licensor.</Text>
                    </li>
                    <li>
                      <Text>"<Text strong>Procured Licensing</Text>": Shall mean non-exclusive licensing agreements procured by the Licensee on behalf of the Licensor.</Text>
                    </li>
                    <li>
                      <Text>"<Text strong>Deliver" or "Delivery</Text>": Licensor is obligated to provide Licensee with all associated files, comprehensive and accurate
                        metadata, high-resolution Album Materials, credit and marketing information, as well as complete and precise ownership details
                        concerning the underlying musical compositions contained within the Assets. This includes information regarding all writers,
                        publishers, and their respective performing rights organizations. Additionally, Licensor must furnish any other pertinent
                        elements reasonably requested by Licensee, all subject to Licensee's discretionary validation and quality control processes.
                        Furthermore, in the case of previously commercially released Assets (e.g., catalog), Licensor must ensure the seamless migration
                        of such Assets to Licensee's platform and subsequent removal by the prior distributor, without any conflicts or third-party
                        claims arising subsequent to Licensee's distribution thereof.</Text>
                    </li>
                    <li>
                      <Text>"<Text strong>Digital Services</Text>": Means digital service providers, third-party digital, mobile, streaming, interactive, non-interactive,
                        cloud, social media, and/or Internet retailers and platforms that distribute, stream, exploit, or otherwise make available music,
                        videos, and other content, including but not limited to platforms, technologies, and services that may come into existence or be
                        developed after the Effective Date.</Text>
                    </li>
                    <li>
                      <Text>"<Text strong>Neighboring Rights Royalties</Text>": Royalties generated from the exploitation of Neighboring Rights.</Text>
                    </li>
                    <li>
                      <Text>"<Text strong>Net Receipts</Text>": The revenue received by Licensee from the exploitation of the  Licensed Content, calculated after deduction
                        of any applicable taxes, third-party fees, and reasonable administration expenses incurred by the Licensee.</Text>
                    </li>
                    <li>
                      <Text>"<Text strong>Recoupable Costs</Text>": Costs incurred by the Licensee in relation to the administration, distribution, and exploitation of the
                        Licensed Content, which are recoverable from the Licensor's share of revenue.</Text>
                    </li>
                    <li>
                      <Text>"<Text strong>Site(s)</Text>": Refers to Licensee sites;</Text>
                    </li>
                    <li>
                      <Text>“<Text strong>The SoundXpand Network</Text>”: means the multi-channel YouTube network for music related video content that includes without limitation
                        the aggregated YouTube channels owned or controlled by Licensee, managed through its YouTube content management account (“SoundXpand CMS”);</Text>
                    </li>
                    <li>
                      <Text>"<Text strong>Licensed Content</Text>": means all Recordings, Videos, and Assets licensed to Licensee under provision 2 of Schedule A (General Terms and Conditions)</Text>
                    </li>
                    <li>
                      <Text>"<Text strong>Licensed Territory</Text>": means the exploitation of Licensed Content above written as per the provision 4 in Basic Terms.</Text>
                    </li>
                    <li>
                      <Text>"<Text strong>Licensing Terms</Text>": means the duration of this Agreement above written as per the provision 3 in Basic Terms.</Text>
                    </li>
                  </ol>
                </Paragraph>
              </li>
              <li>
                <Paragraph>
                  <Text strong underline>Grant Of Rights</Text>: Licensor hereby irrevocably grants and licenses to Licensee the following exclusive,
                  sub-licensable rights throughout the Licensed Territory and for the entire duration of the Licensing Terms:
                  <br />
                  <ol style={{ listStyleType: 'lower-alpha', paddingTop: '10px' }}>
                    <li>
                      <Text>The exclusive right to convert, digitize, encode, integrate, reproduce, and digitally distribute the Recordings, Videos and
                        Assets, across various Digital Services. This includes streaming services, download platforms, and any other digital distribution
                        channels within the Licensed Territory.</Text>
                    </li>
                    <li>
                      <Text>The exclusive right to digitally distribute, transmit, license, sell, advertise, publish, publicly perform, broadcast, and
                        otherwise exploit the Licensed Content in any electronic or digital format. This means Licensee has the sole authority to make
                        the Licensed Content available to consumers through Digital Services (DSPs, streaming platforms, download services, UGC and any
                        other digital distribution channels) within the Licensed Territory. Additionally, Licensee is authorized to act as Licensor's
                        ISRC manager and assign ISRCs to the Recordings.</Text>
                    </li>
                    <li>
                      <Text>Non-exclusive right to stream or broadcast parts of the Licensed Content as preview clips for promotional purposes. These
                        clips can be made available on Licensee's platforms or Digital Services but are not downloadable by consumers.</Text>
                    </li>
                    <li>
                      <Text>The exclusive right to manage and administer third-party audio, visual, and audiovisual content that incorporates or
                        synchronizes with the Licensed Content on Digital Services. This includes using Content ID systems to track, monetize,
                        and manage such content, as well as managing neighboring rights royalties associated with the Licensed Content.</Text>
                    </li>
                    <li>
                      <Text>Non-exclusive right to use approved artist materials for promotional purposes related to the distribution and
                        exploitation of the Licensed Content.</Text>
                    </li>
                    <li>
                      <Text>Non-exclusive right to exploit the musical compositions embodied in the Licensed Content for distribution and
                        monetization purposes.</Text>
                    </li>
                    <li>
                      <Text>Non-exclusive right to license the use and exploitation of the Licensed Content for synchronization in audiovisual
                        works and other purposes, enabling Licensee to enter into agreements for the use of the content in various media formats
                        and platforms.</Text>
                    </li>
                    <li>
                      <Text>The exclusive right to administer, collect revenue from, and exploit all rights to the Licensed Content uploaded to
                        the YouTube channel. This includes managing advertising, monetization, and content ID for the channel. Additionally, if
                        opted, Licensee can provide channel management services and include the channel within The SoundXpand Network (MCN).</Text>
                    </li>
                    <li>
                      <Text>Unless otherwise specified, the granted rights are exclusive throughout the Licensed Territory for the duration of
                        the agreement, giving Licensee sole authority to distribute and exploit the content within the Licensed Territory.</Text>
                    </li>
                    <li>
                      <Text>Where Licensee have made reasonable efforts to consult with Licensor, consistent with Licensee obligations, Licensee
                        reserve the right to resolve copyright infringement disputes, claims, and strikes at Licensee discretion if Licensee reasonably
                        believe that the dispute, claim, or strike exposes either party to significant financial, reputational, or legal liability.</Text>
                    </li>
                  </ol>
                </Paragraph>
              </li>
              <li>
                <Paragraph>
                  <Text strong underline>Restrictions</Text>: The Licensor shall not:
                  <br />
                  <ol style={{ listStyleType: 'lower-alpha', paddingTop: '10px' }}>
                    <li>
                      <Text>Transfer, sub-license, or assign any of the rights granted herein without the prior written consent of the Licensee.</Text>
                    </li>
                    <li>
                      <Text>Distribute or exploit the Licensed Content outside the scope of this Agreement without the Licensee's approval.</Text>
                    </li>
                    <li>
                      <Text>Licensor shall use or allow or permit the use of any Licensed Content or image of any Artist for the advertising,
                        endorsement, or promotion of any third-party recording, product, service, or brand.</Text>
                    </li>
                  </ol>
                </Paragraph>
              </li>
              <li>
                <Paragraph>
                  <Text strong underline>Assignment</Text>: Neither party shall assign or transfer its rights or obligations under this Agreement without
                  the prior written consent of the other party, except to a successor in interest by way of merger, acquisition, or sale of all or
                  substantially all of its Assets.
                </Paragraph>
              </li>
              <li>
                <Paragraph>
                  <Text strong underline>Obligations</Text>:
                  <br />
                  <ol style={{ listStyleType: 'lower-alpha', paddingTop: '10px' }}>
                    <li>
                      <Text>Licensee Obligations: During the Licensing Terms, Licensee shall:</Text>
                      <ol style={{ listStyleType: 'lower-roman', paddingTop: '10px' }}>
                        <li>Collect revenue generated by any activity and exploitation of the Licensed Content.</li>
                        <li>Edit metadata related to the Licensed Content for the purposes of accuracy and optimizing visibility, revenue, and quality.</li>
                        <li>Collect all royalties, fees, and other income arising from the exercise of the rights   granted to Licensee during the
                          Licensing Terms.</li>
                        <li>Make and stream preview clips of the Assets.</li>
                        <li>Make available the Licensed Content by means of Digital Distribution.Pursuant to section 6 of Schedule A (General Terms And
                          Conditions), Licensee undertake to furnish Licensor with a quarterly report, inclusive of details regarding the conclusion of
                          any new agreements with Digital Services for the supply of Licensed Content, any sales reports or sums received concerning
                          the exploitation of the Licensed Content, and any withdrawals from or terminations of agreements with Digital Services.</li>
                      </ol>
                    </li>
                    <li>
                      <Text>Licensor Obligations: Upon execution of this Agreement and throughout the Licensing Terms, Licensor shall:</Text>
                      <ol style={{ listStyleType: 'lower-roman', paddingTop: '10px' }}>
                        <li>Provide accurate and complete information regarding the Recordings, Videos and Assets, to Licensee.</li>
                        <li>Notify Licensee of any third-party claims or disputes related to the Licensed Content.</li>
                        <li>comply with Digital Services rules and requirements.</li>
                        <li>Provide, promptly, such Recordings, Videos and Assets, input materials, and other information as Licensee may reasonably require for the exercise of Licensee rights and fulfillment of Licensee obligations.</li>
                        <li>Deliver the Licensed Content to Licensee under the Delivery Specifications and Delivery Timelines are made available by Licensee in Licensee support documentation.</li>
                      </ol>
                    </li>
                  </ol>
                </Paragraph>
              </li>
              <li>
                <Paragraph>
                  <Text strong underline>Accounting</Text>:
                  <br />
                  <ol style={{ listStyleType: 'lower-alpha', paddingTop: '10px' }}>
                    <li>
                      <Text>The Licensee shall provide quarterly accounting statements to the Licensor, detailing all revenue collected and
                        expenses incurred in relation to the exploitation of the Licensed Content. The Licensor's entitlement to
                        Net Receipts shall encompass all publishing, mechanical royalties, and other compensations due to all royalty participants
                        a.associated with the Licensed Content and the musical compositions embodied therein unless expressly disbursed directly
                        by the Digital Services. In instances where Licensee disburses publishing income, royalties, or other payments directly
                        to third parties, either as directed by the Licensor or mandated by law (including, but not limited to, performance
                        rights organizations), such amounts shall be debited from the Licensor’s share of Net Receipts. The Licensor shall
                        assume responsibility for all taxes imposed on the Licensor concerning all income received pursuant to this Agreement.
                        Licensee is entitled to rely on accounting, usage, and other statements received from Licensee ’s sublicensees (including,
                        but not limited to, YouTube Analytics) for all purposes under this Agreement.
                      </Text>
                    </li>
                    <li>
                    <Text>Licensee will promptly account for and pay Licensor's share of Net Receipts quarterly via the Site. This includes all
                      revenue generated from the Licensed Content as outlined herein. Payments will be facilitated through Bank Transfer,
                      PayPal or any other method designated by Licensee, subject to associated third-party fees. Licensor is responsible for
                      managing account withdrawals and safeguarding account credentials. Licensor must raise any objections to accounting statements
                      within one year of receipt, waiving any longer statute of limitations permitted by law.</Text>
                    </li>
                    <li>
                    <Text>Licensor acknowledges that Licensee reserves the right to freeze and withhold any revenues in Licensor’s account related
                      to Content deemed by Licensee, at its sole discretion, to violate this Agreement or the Site Agreements. Licensee will provide
                      written notice of such with-holdings and will review any response from Licensor. If Licensee, in good faith and with legal
                      counsel agreement, believes such revenues result from Licensor's fraud or infringement, they will be forfeited. Licensor agrees
                      to bear any costs incurred by Licensee due to fraudulent or infringing activities, including legal fees, deducted from future
                      payments. Licensor consents to Licensee disclosing personal and accounting information for copyright claims. Licensor acknowledges
                      Digital Services may have their own fraud and infringement policies, which Licensor must adhere to.</Text>
                    </li>
                  </ol>
                </Paragraph>
              </li>
              <li>
                <Paragraph>
                  <Text strong underline>Change Control</Text>: Any changes or modifications to this Agreement shall be made in writing and signed by both parties.
                </Paragraph>
              </li>
              <li>
                <Paragraph>
                  <Text strong underline>Confidentiality</Text>: The terms and conditions of this Agreement are confidential and shall not be disclosed by the Licensor
                  to any third party, except professional advisors, without prior written consent from Licensee. Disclosure may only occur if required by applicable
                  law or legal process, in which case Licensor must notify Licensee at least five (7) days in advance to allow Licensee the opportunity to seek protective measures.
                </Paragraph>
              </li>
              <li>
                <Paragraph>
                  <Text strong underline>Warranties and Indemnity</Text>:
                  <br />
                  <ol style={{ listStyleType: 'lower-alpha', paddingTop: '10px' }}>
                    <li>
                      <Text>Licensor represents and warrants that:</Text>
                      <ol style={{ listStyleType: 'lower-roman', paddingTop: '10px' }}>
                        <li>Licensor has the legal capacity to enter into this Agreement and fulfill all obligations outlined herein, granting the rights specified.</li>
                        <li>Licensor is either 18 years of age or older, or if under 18, Licensor's legal guardian is entering into this Agreement on their behalf.</li>
                        <li>Licensor is the licensor of or otherwise possesses control over, or has obtained the necessary rights and licenses to, the Recordings,
                          Videos and Assets, enabling Licensee to exercise the rights granted herein.</li>
                        <li>Licensor has not granted, and shall not grant, any rights to any third party that conflict with those granted to Licensee herein.</li>
                        <li>Licensor assumes sole responsibility for payment of royalties or other dues to any third parties resulting from Licensee's exercise of
                          its rights herein, including but not limited to performing rights organizations, writers, co-writers, producers, performers, and other
                          royalty participants.</li>
                        <li>The Licensed Content, including but not limited to the Recordings, Videos and Assets, YouTube Content, and underlying musical compositions,
                          and all materials provided by Licensor to Licensee, and Licensee's use of the rights granted herein, shall not infringe upon any other material,
                          or violate any common law or statutory rights, including but not limited to copyright, trademark rights, and rights of privacy and publicity, of
                          any third party.</li>
                          <li>Licensor is unaware of any material claims, or basis for such claims, which could challenge the ownership or validity of the Licensed Content.</li>
                      </ol>
                    </li>
                    <li>
                      <Text>Licensor agrees to indemnify, defend, and hold harmless Licensee, its affiliates, assigns, sub-distributors, and licensees, as well as their
                        directors, officers, shareholders, agents, and employees, from and against all third-party claims and resulting damages, liabilities, losses, costs,
                        and expenses, including reasonable attorneys’ fees and court costs. This indemnification arises from any breach or alleged breach by Licensor of
                        any warranty, representation, or agreement made herein, or from any act, error, or omission committed by Licensor or any person or entity acting
                        on Licensor’s behalf or under Licensor’s direction or control. In the event of a claim or action, Licensee reserves the right to withhold payment
                        of any and all monies due to Licensor hereunder, in reasonable amounts related to such claim or action, pending its disposition.</Text>
                    </li>
                    <li>
                      <Text>
                        Nothing in this Agreement shall compel Licensee to distribute, reproduce, exploit, or otherwise utilize any of the Recordings, Videos and Assets, or
                        other Licensed Content, all of which remains at Licensee’s sole discretion. Licensee reserves the right to refrain from providing or discontinue
                        any services related to any Recordings and/or Videos at its sole discretion, including, but not limited to, instances of poor recording quality
                        or content deemed hateful, obscene, or inappropriate. Additionally, Licensee unilaterally retains the right to remove any Licensed Content or
                        other materials from the Site and services if it determines, in its sole discretion, that such content violates the Site Agreements, the Digital
                        Services Agreements, or the terms and conditions of this Agreement.
                      </Text>
                    </li>
                    <li>
                      <Text>
                        Licensee's aggregate liability for any claims arising from or related to this Agreement shall not exceed the total amount paid by Licensee to Licensor
                        within the one (1) year period preceding the breach or alleged breach giving rise to such liability. In no event shall Licensee be liable to Licensor
                        or any third party for any indirect, consequential, exemplary, incidental, special, or punitive damages, including damages for lost profits or lost data,
                        arising from or in connection with this Agreement. The limitations of liability outlined in this Section 9(d) of Schedule A (General Terms and Conditions)
                        shall apply regardless of the cause of action, including claims for breach of contract, negligence, strict liability, or other tort, and regardless of
                        whether the parties were or should have been aware of the possibility of such damages. Both parties acknowledge that these limitations are an essential
                        aspect of this Agreement, reflect a reasonable allocation of risk, and agree that they would not have entered into this Agreement without these limitations
                        on liability.
                      </Text>
                    </li>
                  </ol>
                </Paragraph>
              </li>
              <li>
                <Paragraph>
                  <Text strong underline>Termination</Text>:
                  <br />
                  <ol style={{ listStyleType: 'lower-alpha', paddingTop: '10px' }}>
                    <li>
                      <Text>
                        Licensor retains the right to terminate the Licensing Terms by providing ninety (90) days prior written notice to Licensee (email being sufficient),
                        with termination taking effect at the conclusion of the current period (the “Termination Date”). Subsequent to the Termination Date, Licensee has
                        a thirty (30) day window to request takedown of all Licensed Content; however, Licensor acknowledges that actual takedown timing by Digital Services
                        may vary. Following Licensing Terms expiration, Licensee retains a collection period until receipt of payment for all Licensed Content exploitations
                        authorized herein, inclusive of payments from Digital Services and license fees arising from Procured Licensing.
                      </Text>
                    </li>
                    <li>
                      <Text>
                        Licensee reserves the right to terminate this Agreement, remove any of Licensed Content from the Site(s), cease providing services to Licensor,
                        and/or halt the exploitation and distribution of any Recordings, Videos and Assets, at any time. This action may be taken if Licensee determines
                        that: (i) Licensed Content infringes or may infringe upon third-party rights, (ii) Licensor has violated the Site Agreements, the Digital Services
                        Agreements (as defined below), or the terms and conditions of this Agreement, (iii) Licensed Content may be offensive or obscene, (iv) Licensor’s
                        actions or Licensed Content may harm Licensee or tarnish Licensee's reputation, or (v) for any other reason, or no reason, that Licensee deems fit
                        in its sole discretion. In the event of termination by Licensee pursuant to (i), (ii), (iii), or (iv) above, Licensor agrees, in addition to other
                        rights and remedies available to Licensee, to immediately pay to Licensee the then-current unrecouped balance of Recoupable Costs.
                      </Text>
                    </li>
                    <li>
                      <Text>
                        In the event of termination of this Agreement, Sections 6(c), 8, 9, 10(a), 10(c), and 11 of Schedule A (General Terms and Conditions) shall remain in effect.
                      </Text>
                    </li>
                  </ol>
                </Paragraph>
              </li>
              <li>
                <Paragraph>
                  <Text strong underline>Miscellaneous</Text>:
                  <br />
                  <ol style={{ listStyleType: 'lower-alpha', paddingTop: '10px' }}>
                    <li>
                      <Text>
                        The parties mutually agree and acknowledge that they operate as independent contractors under this Agreement. It is explicitly stated that this
                        Agreement does not establish a partnership or joint venture, and neither party acts as the agent, partner, or employee of the other.
                      </Text>
                    </li>
                    <li>
                      <Text>
                        Licensor agrees to abide by the Terms and Conditions, ISRC Terms and Conditions and Privacy Policy of the Site(s) (available at
                        https://Licensee.com/legal#terms-and-conditions, https://Licensee.com/legal#isrc-terms-and-conditions, and https://Licensee.com/legal#privacy-policy,
                        respectively), as well as any other agreements on the Site(s) applicable to Licensor (collectively referred to as the “Site Agreements”), which may be
                        amended or updated from time to time on the Site(s). Licensor also agrees to adhere to the terms of use and privacy policies of Digital Services
                        (including, but not limited to, YouTube and Google) as they relate to Licensor, the use of Digital Services' platforms, the exploitation of Licensed
                        Content, and the rights granted herein (the “Digital Services Agreements”). In case of any conflict between the terms of this Agreement and the Site
                        Agreements or Digital Services Agreements, the terms of this Agreement shall prevail. This Agreement, in conjunction with the Site Agreements,
                        constitutes the entire understanding between the parties regarding the subject matter herein and supersedes any prior agreements or arrangements
                        between Licensor and Licensee concerning the services, if any. Any modifications to this Agreement must be made in writing and accepted and/or
                        signed by both parties.
                      </Text>
                    </li>
                    <li>
                      <Text>
                      This Agreement will be binding upon the assigns, heirs, executors, affiliates, agents, administrators, and successors of each party. Licensee reserves
                      the right to freely assign this Agreement to any party at any time in its sole discretion without providing notice to Licensor. Licensor acknowledges
                      and agrees that neither this Agreement nor any right or interest herein may be assigned or transferred by Licensor without the express prior written
                      consent of Licensee.
                      </Text>
                    </li>
                    <li>
                      <Text>
                          All notices under this Agreement shall be communicated in writing via electronic mail. If Licensee is issuing a notice to Licensor, Licensee will
                          employ the contact information provided by Licensor upon registration with Licensee or as updated by Licensor. In the absence of a valid email
                          address, Licensee may opt for alternative methods at its sole discretion, including, but not limited to, posting to Licensor’s account on the Site.
                          All notices to Licensee should be directed to support@soundxpand.com. Notices are considered received: (i) 24 hours after the electronic mail message
                          was dispatched, provided no "system error" or other notice of non-delivery is generated, or (ii) upon posting if transmitted via other electronic means,
                          if permissible. If applicable law mandates that a communication be "in writing," both parties agree that email communication meets this requirement.
                      </Text>
                    </li>
                    <li>
                      <Text>
                        If any provision of this Agreement or its application is declared invalid or unenforceable by a court of competent jurisdiction or arbitration proceeding
                        under this Agreement, such ruling shall not nullify or void the remaining provisions of this Agreement. It is the mutual intent and agreement of the parties
                        that this Agreement shall be considered amended by adjusting the invalidated provision to the extent necessary to validate, legalize, and enforce it while
                        upholding its original intent. If such modification is not feasible, an alternative provision shall be substituted that is valid, legal, and enforceable,
                        thereby materially effectuating the parties' intent.
                      </Text>
                    </li>
                    <li>
                      <Text>
                      The failure or delay of either party to exercise any right or remedy under this Agreement shall not constitute a waiver of that right or remedy. Furthermore,
                      the partial or single exercise of any right or remedy by either party shall not prevent the further exercise of that right or remedy, nor shall it impede the
                      exercise of any other right or remedy available to either party.
                      </Text>
                    </li>
                    <li>
                      <Text>
                      No waiver or discharge of any breach shall be valid unless it is in writing and signed by the party granting the waiver.
                      </Text>
                    </li>
                    <li>
                      <Text>
                      The rights and remedies granted in this Agreement are cumulative and do not exclude any rights and remedies provided by law or otherwise.
                      </Text>
                    </li>
                    <li>
                      <Text>
                      Neither party shall be considered in breach of this Agreement nor bear responsibility or liability for any losses arising from any delay or failure in
                      the performance of its obligations under this Agreement due to events beyond its reasonable control, commonly referred to as events of force majeure.
                      However, the defaulting party must promptly inform the other party of the nature and reasons for the delay or failure and must make reasonable efforts
                      to mitigate the effects of any default as soon as possible. If such a force majeure event persists for more than three (3) months, either party may
                      terminate this Agreement by providing written notice to the other party, without prejudice to any rights of the parties existing prior to such termination.
                      </Text>
                    </li>
                    <li>
                      <Text>
                      Any third party not explicitly mentioned in this Agreement shall not have the right under the Indian Contract Act, 1872 to invoke or enforce any provision of this Agreement.
                      </Text>
                    </li>
                    <li>
                      <Text>
                      This Agreement shall be governed by and construed in accordance with the laws of Republic of India, and the parties hereby submit to the non-exclusive
                      jurisdiction of the Civil Court in Dumka for any claim, dispute, or other matter arising under or in relation to this Agreement.
                      </Text>
                    </li>
                    <li>
                      <Text>
                      In case of any dispute arising out of or in connection with this Agreement, the parties agree to resolve it through arbitration under the Indian Arbitration
                      and Conciliation Act, 1996. The arbitration proceedings shall take place in Dumka, Jharkhand, Republic of India, and the language used shall be English or
                      Hindi. The decision made by the arbitrator(s) shall be conclusive and binding on both parties.
                      </Text>
                    </li>
                    <li>
                      <Text>
                      This Agreement may be executed through physical signatures, digital or electronic signatures, or by the act of clicking 'I agree' in a checkbox or
                      'click-through' format, and/or exchanged via email, mail, post, or other digital means.
                      </Text>
                    </li>
                  </ol>
                </Paragraph>
              </li>
              <Paragraph strong>
              Licensor understands that the General Terms and Conditions contain a binding arbitration provision in section 11(l), which includes Indian law as
              the governing law, and waiver of jury trials and class actions, governing disputes arising from this Agreement. By signing below, Licensor expressly
              consents to such arbitration provision in section 9(h) of the General Terms and Conditions.
            </Paragraph>
            <Paragraph strong>
              Licensor acknowledges that they have been advised to seek independent legal and business counsel regarding this Agreement. Licensor further acknowledges
              that they have either sought and obtained such counsel or consciously chosen not to do so. It is understood that this Agreement is jointly drafted by
              the parties and may not be construed against any party due to its preparation or word processing.
            </Paragraph>
            <Paragraph>
              IN WITNESS WHEREOF, the parties hereto have executed this Agreement as of the Effective Date first above written.
            </Paragraph>
            </ol>
            </div>
          ) : (
            <Text>Loading the agreement...</Text>
          )}
        </div>
        {userData && (
          <div style={{ marginTop: '16px'}}>
            <Form form={form} onFinish={onFinish}>
              <p style={{ marginBottom: '-4px' }}>Agree to the following statement *</p>
              <Form.Item
                name="checkboxStatement"
                valuePropName="checked"
                rules={[{ validator:(_, value) => value ? Promise.resolve() : Promise.reject('Please accept the agreement!') }]}
              >
                <Checkbox disabled={!isScrolledToEnd}>
                  {checkboxStatement}
                </Checkbox>
              </Form.Item>
              <p style={{ marginTop: '5px' }}>Typing your full name in the box below will act as your digital signature. *</p>
              <Form.Item
                name="fullName"
                label=""
                hasFeedback
                rules={[{ required: true, message: 'Please type your full name' }]}
              >
                <Input placeholder="" disabled={!isScrolledToEnd} style={{ width: 300 }} />
              </Form.Item>
              <Button type="primary" htmlType="submit" disabled={!isScrolledToEnd}>Submit</Button>
            </Form>
          </div>
        )}
      </Card>
    </div>
  );
};

export default TermsAndConditions;
